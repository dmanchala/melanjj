const mongoose = require('mongoose');
const keys = require('../config/keys');
const fs = require('fs');
require('../models/Dataset');

mongoose.connect(keys.mongoUri);
const Dataset = mongoose.model('Dataset');

const columns = [
  {
    name: 'key',
    type: 'INTEGER',
    description: "The Echo Nest's estimate of the track's key.",
  },
  {
    name: 'mode_confidence',
    type: 'FLOAT',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of the track's mode.",
  },
  {
    name: 'artist_mbtags_count',
    type: 'INTEGER[]',
    description: "The raw counts of the artist's MusicBrainz tags.",
  },
  {
    name: 'key_confidence',
    type: 'FLOAT',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of the track's key.",
  },
  {
    name: 'sections_start',
    type: 'FLOAT[]',
    description:
      'The Echo Nest estimated the number of sections in the track and their start times, represented by this array.',
  },
  {
    name: 'tatums_start',
    type: 'FLOAT[]',
    description:
      'The Echo Nest estimated the number of tatums in the track and their start times, represented by this array.',
  },
  {
    name: 'energy',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the tracks's energy, between 0 and 1. A 0 means the track wasn't analyzed.",
  },
  {
    name: 'sections_confidence',
    type: 'FLOAT[]',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of each section.",
  },
  {
    name: 'release_7digitalid',
    type: 'INTEGER',
    description: "The 7digital ID for the track's album.",
  },
  {
    name: 'year',
    type: 'INTEGER',
    description: "The year of the track's release, according to MusicBrainz.",
  },
  {
    name: 'duration',
    type: 'FLOAT',
    description: "The track's length in seconds.",
  },
  {
    name: 'artist_mbid',
    type: 'STRING',
    description: 'The MusicBrainz ID for the artist.',
  },
  { name: 'artist_longitude', type: 'FLOAT' },
  {
    name: 'audio_md5',
    type: 'STRING',
    description:
      'The MD5 hash value of the audio file analyzed by The Echo Nest to generate this data.',
  },
  {
    name: 'beats_start',
    type: 'FLOAT[]',
    description:
      'The Echo Nest estimated the number of beats in the track and their start times, represented by this array.',
  },
  {
    name: 'time_signature_confidence',
    type: 'FLOAT',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of the track's time signature.",
  },
  {
    name: 'segments_confidence',
    type: 'FLOAT[]',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of each segment.",
  },
  {
    name: 'title',
    type: 'STRING',
    description: "The song's title.",
  },
  {
    name: 'artist_playmeid',
    type: 'INTEGER',
    description: 'The playme.com ID for the artist.',
  },
  {
    name: 'bars_confidence',
    type: 'FLOAT[]',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of each bar.",
  },
  {
    name: 'artist_7digitalid',
    type: 'INTEGER',
    description: 'The 7digital ID for the artist.',
  },
  {
    name: 'segments_loudness_max_time',
    type: 'FLOAT[]',
    description:
      'For each segment as estimated by The Echo Nest, the time point in seconds at which the loudness is maximum.',
  },
  {
    name: 'danceability',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the track's danceability, between 0 and 1. A 0 means the track wasn't analyzed.",
  },
  {
    name: 'artist_mbtags',
    type: 'STRING[]',
    description: 'The tags the artist received on MusicBrainz.',
  },
  { name: 'artist_familiarity', type: 'FLOAT' },
  {
    name: 'artist_id',
    type: 'STRING',
    description: 'The Echo Nest artist ID.',
  },
  {
    name: 'start_of_fade_out',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the time point in seconds, towards the end of the track, at which the track starts to fade out.",
  },
  {
    name: 'segments_loudness_max',
    type: 'FLOAT[]',
    description:
      'For each segment as estimated by The Echo Nest, the maximum loudness during the segment.',
  },
  {
    name: 'bars_start',
    type: 'FLOAT[]',
    description:
      'The Echo Nest estimated the number of bars in the track and their start times, represented by this array.',
  },
  {
    name: 'analysis_sample_rate',
    type: 'INTEGER',
    description:
      'The sample rate of the audio file analyzed by The Echo Nest to generate this data.',
  },
  {
    name: 'time_signature',
    type: 'INTEGER',
    description:
      "The Echo Nest's estimate of the track's time signature in beats per bar.",
  },
  { name: 'num_songs', type: 'INTEGER' },
  {
    name: 'similar_artists',
    type: 'STRING[]',
    description:
      "An array of 100 IDs of similar artists to this track's artist, as estimated by The Echo Nest.",
  },
  {
    name: 'segments_loudness_start',
    type: 'FLOAT[]',
    description:
      'The Echo Nest estimated the number of segments in the track and their start times, represented by this array.',
  },
  {
    name: 'tempo',
    type: 'FLOAT',
    description: "The Echo Nest's estimate of the track's tempo in BPM.",
  },
  {
    name: 'artist_name',
    type: 'STRING',
    description: "The name of the track's artist.",
  },
  {
    name: 'artist_terms',
    type: 'STRING[]',
    description: "An array of all of the artist's tags on The Echo Nest.",
  },
  {
    name: 'artist_hotttnesss',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the artist's 'hotttness' as of December 2010, when the dataset was created.",
  },
  {
    name: 'end_of_fade_in',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the time point in seconds, at the beginning of the track, at which the track stops fading in.",
  },
  {
    name: 'artist_terms_freq',
    type: 'FLOAT[]',
    description:
      "The frequency of each of the artist's tags from The Echo Nest, between 0 and 1.",
  },
  {
    name: 'beats_confidence',
    type: 'FLOAT[]',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of each beat.",
  },
  {
    name: 'artist_terms_weight',
    type: 'FLOAT[]',
    description:
      "The weight of each of the artist's tags from The Echo Nest, between 0 and 1.",
  },
  {
    name: 'track_7digitalid',
    type: 'INTEGER',
    description: 'The 7digital ID for the track.',
  },
  {
    name: 'segments_start',
    type: 'FLOAT[]',
    description:
      "The Echo Nest estimated the number of beats in the track and their start times (quoting LabROSA: '~ musical event, or onset'), represented by this array.",
  },
  { name: 'artist_location', type: 'STRING' },
  {
    name: 'song_id',
    type: 'STRING',
    description: 'The Echo Nest ID for the song (not this individual track).',
  },
  {
    name: 'track_id',
    type: 'STRING',
    description:
      'The Echo Nest ID for the track analyzed by The Echo Nest to generate this data.',
  },
  {
    name: 'tatums_confidence',
    type: 'FLOAT[]',
    description:
      "The confidence, between 0 and 1, of The Echo Nest's estimate of each tatum.",
  },
  { name: 'artist_latitude', type: 'FLOAT' },
  {
    name: 'mode',
    type: 'INTEGER',
    description: "The Echo Nest's estimate of the track's mode.",
  },
  {
    name: 'song_hotttnesss',
    type: 'FLOAT',
    description:
      "The Echo Nest's estimate of the song's 'hotttness' as of December 2010, when the dataset was created.",
  },
  {
    name: 'release',
    type: 'STRING',
    description:
      'The name of the album on which the track is present. For tracks present on multiple albums, LabROSA selected one album.',
  },
  {
    name: 'loudness',
    type: 'FLOAT',
    description: "Quoting LabROSA: 'The general loudness of the track'.",
  },
  {
    name: 'segments_timbre',
    type: 'FLOAT[][]',
    description: "Quoting LabROSA: 'MFCC-like features for each segment'.",
  },
  {
    name: 'segments_pitches',
    type: 'FLOAT[][]',
    description:
      "Quoting LabROSA: 'chroma features for each segment (normalized so max is 1.)'.",
  },
];

(async () => {
  const dataset = await Dataset.findOne({});
  dataset.collections[0].columns = columns;
  await dataset.save();
  mongoose.disconnect();
})();
