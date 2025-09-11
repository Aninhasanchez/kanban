import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship, Session
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

DATABASE_URL = "sqlite:///./tasks_manager.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, default="a fazer", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="tasks")

Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class UserSchema(UserBase):
    id: int
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    description: str
    sector: str
    priority: str

class TaskCreate(TaskBase):
    user_id: int

class TaskUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskSchema(TaskBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    owner: UserSchema
    class Config:
        from_attributes = True

app = FastAPI(
    title="Gerenciador de Tarefas API",
    description="API para o sistema de gerenciamento de tarefas do desafio SAEP.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=UserSchema, summary="Cadastrar um novo usuário")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    new_user = User(name=user.name, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/", response_model=List[UserSchema], summary="Listar todos os usuários")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@app.post("/tasks/", response_model=TaskSchema, summary="Cadastrar uma nova tarefa")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == task.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    if task.priority not in ["baixa", "média", "alta"]:
        raise HTTPException(status_code=400, detail="Prioridade inválida. Use 'baixa', 'média' ou 'alta'.")
    new_task = Task(
        description=task.description,
        sector=task.sector,
        priority=task.priority,
        user_id=task.user_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks/", response_model=List[TaskSchema], summary="Listar todas as tarefas")
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = db.query(Task).offset(skip).limit(limit).all()
    return tasks

@app.put("/tasks/{task_id}", response_model=TaskSchema, summary="Atualizar uma tarefa")
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    if task_update.priority:
        if task_update.priority not in ["baixa", "média", "alta"]:
            raise HTTPException(status_code=400, detail="Prioridade inválida. Use 'baixa', 'média' ou 'alta'.")
        db_task.priority = task_update.priority
    if task_update.status:
        if task_update.status not in ["a fazer", "fazendo", "pronto"]:
            raise HTTPException(status_code=400, detail="Status inválido. Use 'a fazer', 'fazendo' ou 'pronto'.")
        db_task.status = task_update.status
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", summary="Excluir uma tarefa")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    db.delete(db_task)
    db.commit()
    return {"message": f"Tarefa {task_id} excluída com sucesso."}

if __name__ == "__main__":
    import uvicorn
    if os.path.exists("tasks_manager.db"):
        os.remove("tasks_manager.db")
    Base.metadata.create_all(bind=engine)
    print("Banco de dados SQLite 'tasks_manager.db' criado/resetado.")
    uvicorn.run(app, host="127.0.0.1", port=8000)