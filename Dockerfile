FROM node:16.13.1 AS client
WORKDIR /app
COPY ./client .
RUN npm i
RUN npm run build


FROM rust:1.60 AS server
WORKDIR /app
COPY . .
COPY --from=client /app/dist ./client/dist
RUN cargo build --release
CMD ["./target/release/convex-hull"]

