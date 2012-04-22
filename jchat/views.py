# -*- encoding: UTF-8 -*-

from datetime import datetime

from django.http import HttpResponse, Http404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User 

from models import Room, Message

from Anka_Dreles.jchat.utils import render_to_json


@login_required
def send(request):
    if request.method != 'POST':
        raise Http404

    if 'chat_last_message_receive' not in request.session and 'chat_room_id' not in request.session:
        raise Http404
    
    r = Room.objects.get(id=int(request.session['chat_room_id']))
    r.say(request.user, request.POST['message'])
    return HttpResponse('')


@login_required
def receive(request):
    if request.method != 'POST':
        raise Http404

    if 'chat_last_message_receive' not in request.session and 'chat_room_id' not in request.session:
        raise Http404

    r = Room.objects.get(id=request.session['chat_room_id'])

    m = r.messages(request.session['chat_last_message_receive'])

    c = m.order_by('id').reverse()
    if c.count()>0:
        request.session['chat_last_message_receive'] = c.all()[0].id

    return HttpResponse(jsonify(m, ['id','author','message','type','timestamp']))


@login_required
@render_to_json()
def join(request):
    if request.method != 'POST':
        raise Http404

    if 'chat_room_id' not in request.session:
        raise Http404
    #TODO  initialise request.session['chat_room_id'] in you view with a existing room id

    r = Room.objects.get(id=int(request.session['chat_room_id']))

    c = r.messages(0).order_by('id').reverse()
    if c.count()>0:
       request.session['chat_last_message_receive'] = c.all()[0].id - 7
    else:
       request.session['chat_last_message_receive'] = 0

    r.join(request.user)
    return {'user' : request.user.username,}


@login_required
def leave(request):
    if request.method != 'POST':
        raise Http404

    if 'chat_last_message_receive' not in request.session and 'chat_room_id' not in request.session:
        raise Http404

    r = Room.objects.get(id=int(request.session['chat_room_id']))
    r.leave(request.user)
    

    del request.session['chat_room_id']
    del request.session['chat_last_message_receive']

    return HttpResponse('')



def jsonify(object, fields=None, to_dict=False):
    '''Simple convert model to json'''
    try:
        import json
    except:
        import django.utils.simplejson as json
 
    out = []
    if type(object) not in [dict,list,tuple] :
        for i in object:
            tmp = {}
            if fields:
                for field in fields:
                    tmp[field] = unicode(i.__getattribute__(field))
            else:
                for attr, value in i.__dict__.iteritems():
                    tmp[attr] = value
            out.append(tmp)
    else:
        out = object
    if to_dict:
        return out
    else:
        return json.dumps(out)
