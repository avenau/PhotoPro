JAJAC PhotoPro Capstone Project
-------------------------------

PhotoPro by JAJAC is a revolutionary new platform in the stock photography market.
PhotoPro was built using React, Python, Flask and MongoDB.

Getting started
---------------
Requirements
------------

Note that the following dependencies should already be installed on VLAB. Please ensure that they are.

- python3
- python3-venv
- python3-pip
- npm

All other dependencies are managed by npm in `frontend/package.json`
and pip in `backend/requirements.txt`

Setting up the project on VLAB
------------------------------

Unzip our software quality submission.

`$ unzip project.zip -d photopro`

Change into the root directory of our application.

`$ cd photopro`

Install the requirements of PhotoPro by running the `prepare.sh` script.

`$ ./prepare.sh -l -r`

Note: Running `-l` with `prepare.sh` is required to download all the images
from our remote file system to VLAB's local file system as all logic is required
to run on VLAB. Running `-r` with `prepare.sh` will reset the remote database
to a pre-saved state, this is to ensure stability between the required local
filesystem and remote database.

The prepare script only needs to be run once.

It will take a few minutes to install all the dependencies.

Running the project on VLAB
---------------------------

In the photopro directory, run the start script to start PhotoPro.

`$ ./start.sh -l`

Note: By running start.sh with the -l flag the user will be interacting with files
on the local file system as opposed to a remote server. Note that the database is
hosted on an external server, not on the user’s machine.

If you want to change the showdown duration for testing purposes, you can run this start script command instead.

`$ ./start.sh -s <duration minutes>`

e.g. `$ ./start.sh -s 5` will have new showdowns starting every 5 minutes.

And you're done. You can start using PhotoPro!