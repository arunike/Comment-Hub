import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from comments_api.models import Comment

class Command(BaseCommand):
    help = 'Seeds the database with comments.json'

    def handle(self, *args, **kwargs):
        json_path = os.path.join(settings.BASE_DIR.parent, 'comments.json')
        
        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_path}'))
            return

        with open(json_path, 'r') as f:
            data = json.load(f)
            
        comments = data['comments']
        
        for item in comments:
            dt_str = item['date'].replace('Z', '+00:00')
            comment, created = Comment.objects.update_or_create(
                id=item['id'],
                defaults={
                    'author': item['author'],
                    'text': item['text'],
                    'date': datetime.fromisoformat(dt_str),
                    'likes': item['likes'],
                    'image': item['image']
                }
            )
            status = 'Created' if created else 'Updated'
            status = 'Created' if created else 'Updated'
            
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(comments)} comments'))
