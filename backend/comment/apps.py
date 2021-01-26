from django.apps import AppConfig


class CommentConfig(AppConfig):
    name = 'comment'
    def ready(self):
        from actstream import registry
        registry.register(self.get_model('Comment'))
