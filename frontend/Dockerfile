FROM node:20-alpine

WORKDIR /workspace/frontend

ENV HOST=0.0.0.0 \
    PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "npm install && npx react-scripts start"]
