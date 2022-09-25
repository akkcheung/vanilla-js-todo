FROM golang:1.18-alpine3.16 AS builder
RUN apk add build-base
RUN mkdir /build
ADD go.mod go.sum main.go /build/
WORKDIR /build
RUN go build

FROM alpine
RUN adduser -S -D -H -h /app appuser
USER appuser
COPY --from=builder /build/vanilla-js-todo /app/ 
COPY ui/ /app/ui
COPY data/ /app/data
COPY ui-sqlite/ /app/ui-sqlite
COPY data-sqlite/ /app/data-sqlite
COPY index.html app/index.html
WORKDIR /app
CMD ["./vanilla-js-todo"]
