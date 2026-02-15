# 🚀 Deployment Guide: AWS EC2 with Docker

This guide walks you through deploying your **College Management System** to a free-tier AWS EC2 instance using Docker.

## Prerequisites
1.  **AWS Account**: [Sign up here](https://aws.amazon.com/).
2.  **SSH Client**: Terminal (Mac/Linux) or PowerShell/PuTTY (Windows).

---

## Step 1: Launch an EC2 Instance ☁️

1.  Log in to the **AWS Console** and search for **EC2**.
2.  Click **Launch Instance**.
3.  **Name**: `College-Management-System`.
4.  **OS Image**: Select **Ubuntu** (Ubuntu Server 24.04/22.04 LTS).
5.  **Instance Type**: Select `t2.micro` or `t3.micro` (Free Tier eligible).
6.  **Key Pair**:
    - Click **Create new key pair**.
    - Name it `cms-key`.
    - Select `.pem` format.
    - **Download it** and keep it safe!
7.  **Network Settings**:
    - Check specific boxes to allow traffic:
        - [x] Allow SSH traffic from Anywhere
        - [x] Allow HTTP traffic from the internet
        - [x] Allow HTTPS traffic from the internet
8.  **Launch Instance**.

---

## Step 2: Configure Security Group (Open Port 5000) 🔒

By default, EC2 only opens port 80 (HTTP) and 22 (SSH). We need to open port 5000 (or whichever port Docker maps to).

1.  Go to your EC2 Dashboard -> **Instances**.
2.  Click on your instance ID.
3.  Click the **Security** tab -> Click the **Security Group** link (e.g., `sg-0123...`).
4.  Click **Edit inbound rules**.
5.  **Add Rule**:
    - **Type**: Custom TCP
    - **Port range**: `5000`
    - **Source**: `Anywhere-IPv4` (`0.0.0.0/0`)
6.  Click **Save rules**.

---

## Step 3: Connect to your Instance 🔗

1.  Open your terminal/PowerShell where your key (`cms-key.pem`) is located.
2.  Set permissions (Mac/Linux only): `chmod 400 cms-key.pem`.
3.  Connect via SSH (replace `YOUR_PUBLIC_IP` with your EC2 Public IPv4 address):
    ```bash
    ssh -i "cms-key.pem" ubuntu@YOUR_PUBLIC_IP
    ```
    *Type `yes` if asked to continue connecting.*

---

## Step 4: Install Docker on EC2 🐳

Paste these commands one by one to install Docker:

```bash
# Update packages
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (avoids using sudo for docker commands)
sudo usermod -aG docker $USER
```

**Logout and log back in** for the changes to take effect:
```bash
exit
# Then reconnect:
ssh -i "cms-key.pem" ubuntu@YOUR_PUBLIC_IP
```

---

## Step 5: Deploy Your App 🚀

1.  **Clone your repository**:
    ```bash
    git clone https://github.com/satszzz/College-management-system.git
    cd College-management-system
    ```

2.  **Create your `.env` file**:
    You need to manually create the environment variables file on the server.
    ```bash
    nano .env
    ```
    - Paste your production environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).
    - Press `Ctrl+O`, `Enter` to save, then `Ctrl+X` to exit.

3.  **Build the Docker Image**:
    ```bash
    docker build -t collage-system .
    ```
    *(This may take a few minutes)*

4.  **Run the Container**:
    ```bash
    docker run -d -p 5000:5000 --env-file .env --name collage-app collage-system
    ```

---

## Step 6: Access Your App 🌐

Open your browser and visit:
`http://YOUR_PUBLIC_IP:5000`

🎉 **Congratulations! Your College Management System is live!**

---

## Troubleshooting 🛠️

- **Site not loading?**
  - Check if Security Group has Port 5000 open (Step 2).
  - Check container status: `docker ps`.
  - Check logs: `docker logs collage-app`.

- **Stopping/Updating**:
  ```bash
  docker stop collage-app
  docker rm collage-app
  git pull
  docker build -t collage-system .
  docker run -d -p 5000:5000 --env-file .env --name collage-app collage-system
  ```
