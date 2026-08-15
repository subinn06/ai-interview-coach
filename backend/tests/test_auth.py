def test_register_user(client):
    response = client.post("/auth/register", json={
        "email": "newuser@example.com",
        "full_name": "New Candidate",
        "password": "Password123!"
    })
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["email"] == "newuser@example.com"

def test_register_duplicate_email(client):
    user_data = {
        "email": "duplicate@example.com",
        "full_name": "Original User",
        "password": "Password123!"
    }
    client.post("/auth/register", json=user_data)
    response = client.post("/auth/register", json=user_data)
    assert response.status_code in [400, 409]
    assert "detail" in response.json()

def test_login_user(client):
    client.post("/auth/register", json={
        "email": "loginuser@example.com",
        "full_name": "Login User",
        "password": "Password123!"
    })
    response = client.post("/auth/login", data={
        "username": "loginuser@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_wrong_password(client):
    client.post("/auth/register", json={
        "email": "wrongpass@example.com",
        "full_name": "Wrong Pass User",
        "password": "CorrectPassword123!"
    })
    response = client.post("/auth/login", data={
        "username": "wrongpass@example.com",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert "detail" in response.json()

def test_protected_route_without_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_protected_route_invalid_token(client):
    headers = {"Authorization": "Bearer invalid_garbage_token_123"}
    response = client.get("/auth/me", headers=headers)
    assert response.status_code == 401

def test_get_current_user(client, auth_headers_user1):
    response = client.get("/auth/me", headers=auth_headers_user1)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user1@example.com"
