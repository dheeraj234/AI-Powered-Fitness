FROM quay.io/keycloak/keycloak:24.0

# Switch to root to install things
USER root

# Set working directory
WORKDIR /opt/keycloak

# Build optimized Keycloak image
RUN /opt/keycloak/bin/kc.sh build

# Switch back to keycloak user
USER 1000

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start"]
