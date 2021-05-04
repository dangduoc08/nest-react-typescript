FROM node:14.15.1-alpine AS builder

#install image
WORKDIR /src

#install
COPY ./package* ./
RUN yarn install

COPY . .
RUN yarn run build
RUN yarn run build_output

#image

FROM node:14.15.1-alpine
#ENV NODE_ENV=production
ARG CI_JOB_ID
ENV APPS_APPVERSION=$CI_JOB_ID

WORKDIR /src

# Install deps for production only
COPY ./package* ./
RUN yarn install
#RUN yarn install --production
RUN yarn cache clean

# Copy builded source from the upper builder stage
COPY --from=builder /src/output .

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

# Start the app
CMD yarn run start_prod
