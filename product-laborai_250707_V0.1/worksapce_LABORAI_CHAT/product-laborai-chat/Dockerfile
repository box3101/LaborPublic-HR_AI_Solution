# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

# nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#docker build --no-cache -t sgate-registry-dev.kr.ncr.ntruss.com/sgate-sai-chat:latest .
#docker push sgate-registry-dev.kr.ncr.ntruss.com/sgate-sai-chat:latest
#docker run -d -p 8886:80 -e ENV=dev  --name sgate-sai-chat -it sgate-registry-dev.kr.ncr.ntruss.com/sgate-sai-chat:latest





