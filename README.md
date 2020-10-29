# JAJAC PhotoPro Capstone Project

PhotoPro by JAJAC is a revolutionary new platform in the stock photography market.
PhotoPro was built using React, Python, Flask and MongoDB.

# Getting started 🚀

## Backend Requirements

- python3
- python3-venv
- mongodb

For all others see `requirements.txt`

## Frontend Requirements

- npm
- npx

All other dependencies are managed by npm in `frontend/package.json`

## Running the project

With a fresh copy of the repo install all of the requirements and build the frontend.

`./prepare.sh`

After initially running the prepare script it does not need to be rerun unless changes are made to the code.

Start the webservers.

`./start.sh`

To run the filesystem api locally instead of using the external server the start script can be ran with the `-l` flag, this will attempt to download the images/ directory from the server before running but all images will only be saved and retrieved from localhost.

The website can be restarted with `./start.sh` without running `./prepare.sh` again after the initial run.

The start script can be run with the `-d` option to only run the backend server so frontend can be run in development mode.

# Developer notes

## Frontend

## Setup

**Note all of the following occurs from inside frontend/ directory**

To run this locally you will need to first install all of the required npm packages. You can do this by running `npm install`. This installation only needs to be run when new packages have been added, it is a good idea to run `npm install` whenever you pull a new branch to avoid confusing errors of package mismatch.

To add a dependency you can use `npm add <package-name>`, this will install the new dependency and add it to `package.json` for everyone else to use.

If you run any of the npm commands in the root directory please note that this will not work and these changes should be reverted.

## Running the project

**Note all of the following occurs from inside frontend/ directory**

The project can be run in development mode `npm start`, in this mode npm will watch for changes and update the website as you update the code. To create a production build use `npm run build`, this will create all of the minified javascript and place it in the `build/` directory (please don't commit this).

### Storybook

I have added another evironment where components can be tested using storybook. In this mode components are tested individually which can be useful for testing mnay combinations of inputs all at once. To run this environment use `npm run storybook`.

### Linting

eslint is added and runs on a slight modification to the [Airbnb style guide](https://github.com/airbnb/javascript/tree/master/react). From inside the frontend directory run the following command to lint the project `npx eslint --ext .tsx src/ -f html -o linting.html`. Additionally, quick changes such as spacing and trailing commas etc can be automatically fixed by eslint by adding `--fix` to the above command.

## Backend

### PyMongo

https://www.w3schools.com/python/python_mongodb_getstarted.asp

### Virtual Environments

https://docs.python.org/3/tutorial/venv.html

## Setup

To run this locally you will need to have a running version of MongoDB as well as the required Python packages. These can be installed using pip from within the virtual environment (see below).

### Setting up a virtual Environment

A virtual environment allows us to keep all our required packages within our project. We then add the packages to our `.gitignore`. This stops our project from vommitting all over our system and leaving redundant packages once the project is finished. If you don't care, just run `pip3 install -r requirements.txt` and remember to update it manually whenever you add something new.

#### Creating the virtual environment

From root directory of our project:

Create the python virtual environment directory (ignored in `.gitignore`):

`python3 -m venv env`

#### Setting your virtual environment in your current terminal

Source that virtual environment before each run

`source env/bin/activate`

#### Leaving the virtual environment

Leaving the virtual:

`deactivate`

#### Installing required packages

Source the virtual environment so that packages are stored within our project

`source env/bin/activate`

Install the packages specified in `requirements.txt`

`pip3 install -r requirements.txt`

#### Adding packages to the project

After sourcing the environment:

`pip3 install foo`

or for specific version

`pip3 install foo==3.1.2`

Saving this package to the list of requirements:

`pip3 freeze > requirements.txt`

### Setting up Flask app environment

The backend app settings can be configured in `config.py` in file path `backend/config.py`.

You can use either use the development or production configuration.

- Development: sets flask in testing mode and uploads information to the local mongo database.
- Production: sets flask in production mode and uploads infomation to a remote server mongo database.

Change the line `app.config.from_object({Configuration})` in `app.py`, replacing configuration to the configuration class you want Flask to adhere to.
