# 🎥 MeetHub – Real-Time Video Conferencing Web Application

### 🚧 Project Status: In Development (Academic Group Project – B.Tech CSE 3rd Year)

MeetHub is a full-stack real-time communication web application designed to enable secure video conferencing, voice calls, real-time messaging, and group meetings.

The project is being developed as part of our academic curriculum to explore real-time networking, WebRTC, and full-stack system design using the MERN stack.

### 📌 Project Overview

With the increasing demand for remote collaboration, platforms like Zoom and Google Meet have become essential. MeetHub aims to replicate and understand the core architecture behind such platforms by implementing:

Peer-to-peer video streaming

Real-time chat system

Secure authentication

Meeting link generation

Screen sharing

Meeting scheduling with reminders

This project focuses on scalability, low latency communication, and secure real-time multimedia transmission.

## 🛠️ Tech Stack
#### 💻 Frontend

React.js

Tailwind CSS (if used)

WebRTC APIs

#### 🖥️ Backend

Node.js

Express.js

Socket.io

#### 🗄️ Database

MongoDB

#### 🔐 Authentication

JWT (JSON Web Token)

#### 🌐 Real-Time Technologies

WebRTC (Peer-to-Peer Media Streaming)

WebSocket (via Socket.io for signaling & chat)

STUN Servers (for NAT traversal)

#### 🏗️ System Architecture

MeetHub follows a client-server architecture:

Client (React.js) → Handles UI and media interaction

Server (Node.js + Express.js) → Handles APIs & authentication

Socket.io Server → Manages signaling & real-time chat

WebRTC → Establishes peer-to-peer media connection

MongoDB → Stores user data and meeting records

After signaling through the server, media streams are transmitted directly between peers to reduce latency.

### 🎯 Key Features (Planned & In Progress)

✅ User Registration & Login (JWT-based)

🔄 One-to-One Video Calling

🔄 Group Video Conferencing via Meeting Links

🔄 Real-Time Chat

🔄 Screen Sharing

🔄 Meeting Scheduler with Reminders

🔄 Friend Management System


### 🚀 Development Roadmap

Requirement Analysis & System Design

Database Schema Design

Backend API Development

Frontend UI Implementation

WebRTC Integration

Socket.io Integration

Advanced Features (Screen Sharing, Scheduler)

Testing & Deployment

## 👨‍💻 Team Members

Varun Gaur

Yash Gupta

Vineet Kumar

Vineet Kumar Singh

Under the supervision of:
Prof. Tushar Satija
GLA University, Mathura

#### 🎓 Academic Purpose

This project is developed as part of B.Tech CSE 3rd Year curriculum to gain hands-on experience in:

Full-stack web development

Real-time communication systems

Distributed system design

Peer-to-peer networking

Multimedia streaming

#### 📖 References

WebRTC Official Documentation

Socket.io Documentation

MongoDB Documentation

Johnston & Burnett – WebRTC: APIs and RTCWEB Protocols of the HTML5 Real-Time Web

##### 📌 Current Status

The project is currently under active development. Core architecture and planning have been completed, and implementation of backend APIs and WebRTC signaling is ongoing.
