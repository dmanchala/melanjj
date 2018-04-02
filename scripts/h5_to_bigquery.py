import get3
import os
from google.cloud import bigquery
import pprint
import numpy as np
import pprint
import simplejson
import sendgrid
from sendgrid.helpers.mail import *
import sys
from multiprocessing import Pool, Value
import time
import tables
import ast

pp = pprint.pprint

getters = sorted(filter(lambda f: 'get_' in f, dir(get3)))
column_names = sorted([g.replace('get_', '') for g in getters])


def h5_to_json(fname):
    h5 = get3.open_h5_file_read(fname)
    d = {}

    for g, c in zip(getters, column_names):
        val = None
        try:
            val = getattr(get3, g)(h5)
        except tables.exceptions.NoSuchNodeError:
            val = np.array([])
        if type(val) == type(np.ndarray([])):
            val = str(val.tolist())
        if type(val) in [type(np.float64(0)), type(np.int32(0)), type(np.int64(0))]:
            val = val.item()
        if type(val) == type(np.string_('')):
            val = str(val)
        d[c] = val

    d = simplejson.loads(simplejson.dumps(d, ignore_nan=True))
    h5.close()
    return d


def type_to_bigquery_type(s):

    if s == type(''):
        return 'STRING'
    if s == type(1):
        return 'INTEGER'
    if s == type(1.0):
        return 'FLOAT'


# d = h5_to_csv('TRAXLZU12903D05F94.h5')
# x = d['artist_playmeid']
# assert(len(d) == 55)
# assert(d['artist_playmeid'] == 1338)
# assert(d['title'] == 'Never Gonna Give You Up')
# assert(d['duration'] == 211.69587)
# assert(d['artist_mbid'] == 'db92a151-1ac2-438b-bc43-b82e149ddd50')
# columns = json.dumps([{"name": k, "type": type_to_bigquery_type(type(d[k]))}
#                       for k in d.keys()])
# print(columns)


def email(sub, body):
    sg = sendgrid.SendGridAPIClient(
        apikey='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')
    from_email = Email("million-song-dataset-load-job-no-reply@melanjj.com")
    to_email = Email("dmanchala@gmail.com")
    content = Content("text/plain", body)
    mail = Mail(from_email, sub, to_email, content)
    sg.client.mail.send.post(request_body=mail.get())


root = '..'

client = bigquery.Client.from_service_account_json(
    'melanjj-datasets-prod-76a4d81bf7b8.json')
dataset = bigquery.Dataset(client.dataset('million_song_dataset'))
main_table = bigquery.Table(dataset.table('million_song_dataset'))
segments_timbre_table = bigquery.Table(dataset.table('segments_timbre'))
segments_pitches_table = bigquery.Table(dataset.table('segments_pitches'))


def insert_file(d):
    print('insert_file')
    segments_timbre_row = {
        'track_id': d['track_id'],
        'segments_timbre': d['segments_timbre']
    }
    # segments_pitches_row = {
    #     'track_id': d['track_id'],
    #     'segments_pitches': d['segments_pitches']
    # }
    errors = client.insert_rows_json(
        segments_timbre_table, [segments_timbre_row])
    # client.insert_rows_json(segments_pitches_table, [segments_pitches_row])
    # del d['segments_timbre']
    # del d['segments_pitches']
    # errors = client.insert_rows_json(main_table, [d])
    if errors:
        print sys.getsizeof(d['segments_timbre'])
        raise Exception(str(errors))


def convert_and_insert_file(file_and_path):
    try:
        d = h5_to_json(file_and_path)
        insert_file(d)
    except Exception as e:
        if 'Please try again in 30 seconds.' in str(e):
            time.sleep(30)
            insert_file(d)
        email('Exception', str(type(e)) + '\n\n' + str(e) + '\n\n' + file_and_path +
              '\n\n' + d)
        sys.exit(1)


def convert_all_files(pool):
    for dirpath, _, filenames in os.walk(root):
        for filename in [f for f in filenames if f.endswith('.h5')]:
            file_and_path = os.path.join(dirpath, filename)
            # print(file_and_path)
            pool.apply_async(convert_and_insert_file, (file_and_path,))


def get_all_inserted_track_ids(table_id):
    query_job = client.query(
        'SELECT track_id FROM `melanjj-datasets-prod-199706.million_song_dataset.{}`'.format(table_id))

    inserted_track_ids = set()

    for row in query_job.result():
        inserted_track_ids.add(str(row[0]))

    print('len(inserted_track_ids): ', len(inserted_track_ids))
    return inserted_track_ids


def convert_remaining_files(pool, root, inserted_track_ids):
    for dirpath, _, filenames in os.walk(root):
        for filename in [f for f in filenames if f.endswith('.h5')]:
            track_id = filename.replace('.h5', '')
            if track_id not in inserted_track_ids:
                file_and_path = os.path.join(dirpath, filename)
                pool.apply_async(convert_and_insert_file, (file_and_path,))


def h5_to_segments_pitches(file_and_path, json_file):
    d = h5_to_json(file_and_path)
    row = {
        'track_id': d['track_id'],
        'segments_pitches': d['segments_pitches']
    }
    simplejson.dump(row, json_file)
    json_file.write('\n')


def h5_to_million_song_dataset_row(file_and_path, json_file):
    d = h5_to_json(file_and_path)
    del d['segments_pitches']
    del d['segments_timbre']
    simplejson.dump(d, json_file)
    json_file.write('\n')


def write_all_rows_to_json_file(json_file, inserted_track_ids, write_row_f):
    for dirpath, _, filenames in os.walk(root):
        for filename in [f for f in filenames if f.endswith('.h5')]:
            track_id = filename.replace('.h5', '')
            if track_id not in inserted_track_ids:
                file_and_path = os.path.join(dirpath, filename)
                print(file_and_path)
                write_row_f(
                    file_and_path, json_file)


def insert_json_file(json_file, table_id):
    job_config = bigquery.LoadJobConfig()
    job_config.source_format = 'NEWLINE_DELIMITED_JSON'
    job = client.load_table_from_file(
        json_file, dataset.table(table_id), job_config=job_config)
    job.result()


if __name__ == '__main__':

    random_tracks = {}

    for dirpath, _, filenames in os.walk(root):
        if (len(random_tracks) == 100):
            break
        for filename in [f for f in filenames if f.endswith('.h5')]:
            print(len(random_tracks))
            if (len(random_tracks) == 100):
                break
            file_and_path = os.path.join(dirpath, filename)
            d = h5_to_json(file_and_path)
            h5 = get3.open_h5_file_read(file_and_path)
            d['segments_pitches'] = get3.get_segments_pitches(h5)
            d['segments_timbre'] = get3.get_segments_timbre(h5)
            h5.close()
            random_tracks[d['track_id']] = d

    query = 'SELECT * FROM `melanjj-datasets-prod-199706.million_song_dataset.main` WHERE track_id in {}'.format(
        str(tuple(random_tracks.keys())))
    print(query)
    query_job = client.query(query)

    discrepancies = []

    for row in query_job:
        d = random_tracks[row['track_id']]
        for k in d.keys():
            v = row[k]
            if k == 'year':
                print(d[k], row[k])
            if k in ['segments_timbre', 'segments_pitches']:
                if not np.array_equal(d[k], ast.literal_eval(row[k])):
                    discrepancies += [(d['track_id'], k)]
                break
            elif d[k] != row[k]:
                discrepancies += [(d['track_id'], k)]
                break

    print(discrepancies)
    print(len(discrepancies))

"""
d = {}
Find 10,000 random tracks
Convert them into json
Put them all into d
Select the rows for those 10,000 tracks from bigquery
For each row, compare the values from bigquery with the fields extracted from the h5 file
For segments_timbre and segments_pitches, call AST.literal_eval on the bigquery values
Count the number of mismatches
"""
