# -*- encoding: UTF-8 -*-
from django.conf.urls.defaults import *

urlpatterns = patterns('',
    url(r'^send/$', 'jchat.views.send'),
    url(r'^receive/$', 'jchat.views.receive'),

    url(r'^join/$', 'jchat.views.join'),
    url(r'^leave/$', 'jchat.views.leave'),
)
