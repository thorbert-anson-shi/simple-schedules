# Simple Scheduler

Is a NestJS REST API that allows admins and customers to manage weekly schedules
and appointments.

---

It follows a tried-and-true Controller-Service-Repository pattern. It keeps the
separation of concerns clear and error propagation more explicit.

For example, the controller must only throw HTTP exceptions, the service layer
should explicitly handle lower level errors thrown by the repository layer, etc.

Utilizing NestJS's extensive dependency injection system, I ensured that every
module is only instantiated once, saving memory and increasing server
performance.
