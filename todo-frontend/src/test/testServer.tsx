import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const tasks = [
  { id: 1, title: 'A', description: 'a', createdAt: new Date().toISOString(), completed: false },
  { id: 2, title: 'B', description: 'b', createdAt: new Date().toISOString(), completed: false },
  { id: 3, title: 'C', description: 'c', createdAt: new Date().toISOString(), completed: false },
  { id: 4, title: 'D', description: 'd', createdAt: new Date().toISOString(), completed: false },
  { id: 5, title: 'E', description: 'e', createdAt: new Date().toISOString(), completed: false },
];

export const server = setupServer(
  // GET /tasks  → return only incomplete, then apply the limit
  http.get('http://localhost:8080/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || 5);
    const list = tasks.filter(t => !t.completed).slice(0, limit);
    return HttpResponse.json(list);
  }),

  // POST /tasks  → prepend as incomplete
  http.post('http://localhost:8080/api/tasks', async ({ request }) => {
    const body = (await request.json()) as { title: string; description: string };
    const id = tasks.length + 1;
    tasks.unshift({ id, createdAt: new Date().toISOString(), completed: false, ...body });
    return HttpResponse.json(tasks[0], { status: 201 });
  }),

  // PATCH /tasks/:id/complete
  http.patch('http://localhost:8080/api/tasks/:id/complete', ({ params }) => {
    const id = Number(params.id);
    const t = tasks.find(x => x.id === id);
    if (t) t.completed = true;
    return new HttpResponse(null, { status: 204 });
  }),
);

