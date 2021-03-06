# coding=utf-8

from flask import Flask
from flask_mako import render_template, MakoTemplates
from flask_babel import Babel
from flask_cache import Cache
from flask_mongoengine import MongoEngine
from flask_redis import FlaskRedis
from flask_mail import Mail

from firefly import config

app = Flask(__name__)
app.config.from_object(config)
db = MongoEngine(app)
redis_store = FlaskRedis(app)
mako = MakoTemplates(app)
cache = Cache(app)
babel = Babel(app)
mail = Mail(app)

if app.config['DEBUG']:
    from werkzeug.debug import DebuggedApplication
    app.wsgi_app = DebuggedApplication(app.wsgi_app, True)


def configure_error_handles(app):

    @app.errorhandler(403)
    def forbidden_page(error):
        return render_template('403.html')

    @app.errorhandler(404)
    def not_found_page(error):
        return render_template('404.html')


def register_blueprints(app):
    from firefly.models import auth
    auth.init_app(app)
    from firefly.views import (home, post, api)
    for i in (home, post, api):
        app.register_blueprint(i.bp)
    configure_error_handles(app)


register_blueprints(app)
