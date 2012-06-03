# -*- encoding: UTF-8 -*-

from django.contrib import admin
from jchat.models import *

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0


class RoomAdmin(admin.ModelAdmin):
    model = Room
    inlines = [MessageInline,]
    list_display= ('id','content_type','object_id')
admin.site.register(Room,RoomAdmin)

class MessageAdmin(admin.ModelAdmin):
    model = Message
    list_display= ('type','author','room','timestamp')
admin.site.register(Message,MessageAdmin)
