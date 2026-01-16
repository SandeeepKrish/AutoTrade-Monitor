from pydantic import BaseModel


class DBModelMixin(BaseModel):
  id: str | None = None

