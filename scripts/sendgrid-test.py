import sendgrid
from sendgrid.helpers.mail import *

sg = sendgrid.SendGridAPIClient(
    apikey='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')
from_email = Email("million-song-dataset-load-job-no-reply@melanjj.com")
to_email = Email("dmanchala@gmail.com")
content = Content("text/plain", 'Success')
mail = Mail(from_email, 'Test from EC2', to_email, content)
sg.client.mail.send.post(request_body=mail.get())
