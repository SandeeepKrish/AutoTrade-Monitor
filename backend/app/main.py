from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .api import auth, stocks, cart, orders, rules
from .websocket import price_socket
from .services.automation_engine import start_automation_loop
from .services.market_simulator import market_simulator
import asyncio


from pydantic import BaseModel

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str

app = FastAPI(title="Stock Trading Backend", version="1.0.0")

@app.post("/api/contact")
async def contact_support(payload: ContactMessage):
    # This is where you would integrate an email service like SendGrid, Mailgun, or SMTP.
    # For now, we simulate sending the email to: 2022d1r020@mietjammu.in
    print(f"📧 NEW SUPPORT MESSAGE to 2022d1r020@mietjammu.in")
    print(f"From: {payload.name} ({payload.email})")
    print(f"Subject: {payload.subject}")
    print(f"Message: {payload.message}")
    
    return {"status": "success", "message": "Email sent to support."}


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        str(settings.FRONTEND_ORIGIN)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(rules.router, prefix="/api/rules", tags=["rules"])
app.include_router(price_socket.router, prefix="/ws", tags=["ws"])


@app.on_event("startup")
async def on_startup():
  asyncio.create_task(market_simulator.run_forever())
  await start_automation_loop()

