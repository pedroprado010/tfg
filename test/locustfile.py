from locust import HttpLocust, TaskSet, task, seq_task
from uuid import uuid4
from random import randint
import json

def list_books(l):
  res = l.client.get('/books')
  if res.status_code != 200:
    return None
  book = res.dict()[randint(0,9)]
  if book['exemplars'][0]['loaned']:
    return {'book_id': book['_id'], 'exemplar_id': book['exemplars'][0]['_id']}
  return None

class UserBehaviour(TaskSet):
  def on_start(self):
    res = self.client.post(
      '/account/register',
      data={"email": str(self.locust.user_id)+"@test.com", "password": "123456"},
      headers={'Content-Type': 'application/json'}
    )
    if res.status_code != 200:
      print(res)
      print(res.text)
      print('boom')
      self.interrupt()
    res = self.client.post(
      '/account/login/',
      data={"email": self.locust.user_id+"@test.com", "password": "123456"},
      headers={'Content-Type': 'application/json'}
    )
    if res.status_code != 200:
      print('oizu')
      print(res)
      print(res.text)
      self.interrupt()
    else:
      self.locust.user_token = res.dict()['token']

  def on_stop(self):
    pass

  @task(5)
  def loan_book(self):
    a_book = list_books(self)
    if a_book != None:
      self.client.get(
        '/loan/'+ a_book['book_id'] + '/' + a_book['exemplar_id'],
        headers={"Authorization": self.locust.user_token}
      )

  @task(5)
  def return_book(self):
    my_loans = self.client.put('/loan/:book_id/:exemplar_id', headers={"Authorization": self.locust.user_token})
    print(my_loans)

  @task(4)
  def search_books(self):
    list_books(self)

  @task(1)
  def logout(self):
    self.interrupt()

class LocustUser(HttpLocust):
  task_set = UserBehaviour
  min_wait = 5000
  max_wait = 15000
  user_id = None
  host = 'http://localhost:3000'
  def setup(self):
    self.user_id = uuid4().hex


