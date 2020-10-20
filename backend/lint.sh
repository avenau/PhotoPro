# Add additional directories to where needed
DIRS='app.py config.py lib'
VENV='env/bin/activate'

source $VENV
pylint $DIRS

