FROM registry.redhat.io/ubi8/nodejs-16:1-72 AS web-builder

WORKDIR /opt/app-root

USER 0

COPY web/package*.json web/
COPY Makefile Makefile
RUN make install-frontend-ci-clean

COPY web/ web/
RUN make build-frontend

FROM registry.redhat.io/ubi8/go-toolset:1.18 as go-builder

WORKDIR /opt/app-root

COPY Makefile Makefile
COPY go.mod go.mod
COPY go.sum go.sum

RUN make install-backend

COPY config/ config/
COPY cmd/ cmd/
COPY pkg/ pkg/

RUN make build-backend

FROM registry.access.redhat.com/ubi8-micro:8.7-1

COPY --from=web-builder /opt/app-root/web/dist /opt/app-root/web/dist
COPY --from=go-builder /opt/app-root/plugin-backend /opt/app-root
COPY --from=go-builder /opt/app-root/config /opt/app-root/config

ENTRYPOINT ["/opt/app-root/plugin-backend", "-config-path", "/opt/app-root/config", "-static-path", "/opt/app-root/web/dist"]
