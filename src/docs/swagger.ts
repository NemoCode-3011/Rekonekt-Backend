import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "REKONEKT API",
      version: "1.0.0",
      description: "API for the REKONEKT Digital Museum of Nigerian History",
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "User authentication and account management",
      },
    ],

    paths: {
      "/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Create a visitor account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: {
                      type: "string",
                      example: "John Doe",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Signup successful",
            },
            400: {
              description: "Invalid input",
            },
            409: {
              description: "Email already exists",
            },
          },
        },
      },

      "/auth/verify-otp": {
        post: {
          tags: ["Authentication"],
          summary: "Verify email with OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    otp: {
                      type: "string",
                      example: "123456",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Email verified successfully",
            },
            400: {
              description: "Invalid OTP or input",
            },
          },
        },
      },

      "/auth/signin": {
        post: {
          tags: ["Authentication"],
          summary: "Sign in",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Signin successful",
            },
            401: {
              description: "Invalid credentials",
            },
          },
        },
      },

      "/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Get current user",
          security: [{ sessionCookie: [] }],
          responses: {
            200: {
              description: "Current user retrieved",
            },
            401: {
              description: "Authentication required",
            },
          },
        },
      },

      "/auth/logout": {
        post: {
          tags: ["Authentication"],
          summary: "Log out",
          security: [{ sessionCookie: [] }],
          responses: {
            200: {
              description: "Logout successful",
            },
          },
        },
      },

      "/auth/resend-otp": {
        post: {
          tags: ["Authentication"],
          summary: "Resend verification OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "OTP resent successfully",
            },
            400: {
              description: "Invalid request",
            },
          },
        },
      },

      "/auth/forgot-password": {
        post: {
          tags: ["Authentication"],
          summary: "Request password reset OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password reset OTP sent",
            },
          },
        },
      },

      "/auth/reset-password": {
        post: {
          tags: ["Authentication"],
          summary: "Reset password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp", "newPassword"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    otp: {
                      type: "string",
                      example: "123456",
                    },
                    newPassword: {
                      type: "string",
                      format: "password",
                      example: "newPassword123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password reset successfully",
            },
          },
        },
      },

      "/auth/admins": {
        post: {
          tags: ["Authentication"],
          summary: "Create an admin",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Museum Admin",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "admin@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Admin created successfully",
            },
            403: {
              description: "Super admin access required",
            },
          },
        },
      },

      "/exhibitions": {
        post: {
          tags: ["Exhibitions"],
          summary: "Create an exhibition",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Exhibition created successfully" },
            400: { description: "Invalid input" },
            403: { description: "Access denied" },
          },
        },
        get: {
          tags: ["Exhibitions"],
          summary: "Get all exhibitions",
          responses: {
            200: { description: "Exhibitions retrieved successfully" },
          },
        },
      },

      "/exhibitions/{slug}": {
        get: {
          tags: ["Exhibitions"],
          summary: "Get an exhibition by slug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "aburi",
            },
          ],
          responses: {
            200: { description: "Exhibition retrieved successfully" },
            404: { description: "Exhibition not found" },
          },
        },
      },

      "/exhibitions/{id}": {
        patch: {
          tags: ["Exhibitions"],
          summary: "Update an exhibition",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Exhibition updated successfully" },
            404: { description: "Exhibition not found" },
          },
        },
        delete: {
          tags: ["Exhibitions"],
          summary: "Delete an exhibition",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Exhibition deleted successfully" },
            404: { description: "Exhibition not found" },
          },
        },
      },

      "/exhibitions/{id}/publish": {
        patch: {
          tags: ["Exhibitions"],
          summary: "Publish an exhibition",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Exhibition published successfully" },
            404: { description: "Exhibition not found" },
          },
        },
      },
      "/sections": {
        post: {
          tags: ["Sections"],
          summary: "Create a section",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Section created successfully" },
          },
        },
      },

      "/sections/exhibitions/{exhibitionId}": {
        get: {
          tags: ["Sections"],
          summary: "Get sections for an exhibition",
          parameters: [
            {
              name: "exhibitionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Sections retrieved successfully" },
          },
        },
      },

      "/sections/{id}": {
        get: {
          tags: ["Sections"],
          summary: "Get section by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Section retrieved successfully" },
            404: { description: "Section not found" },
          },
        },
        patch: {
          tags: ["Sections"],
          summary: "Update section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Section updated successfully" },
          },
        },
        delete: {
          tags: ["Sections"],
          summary: "Delete section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Section deleted successfully" },
          },
        },
      },
      "/stories": {
        post: {
          tags: ["Stories"],
          summary: "Create a story",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Story created successfully" },
          },
        },
      },

      "/stories/sections/{sectionId}": {
        get: {
          tags: ["Stories"],
          summary: "Get stories for a section",
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Stories retrieved successfully" },
          },
        },
      },

      "/stories/{id}": {
        get: {
          tags: ["Stories"],
          summary: "Get story by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Story retrieved successfully" },
          },
        },
        patch: {
          tags: ["Stories"],
          summary: "Update story",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Story updated successfully" },
          },
        },
        delete: {
          tags: ["Stories"],
          summary: "Delete story",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Story deleted successfully" },
          },
        },
      },
      "/events": {
        post: {
          tags: ["Events"],
          summary: "Create an event",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Event created successfully" },
          },
        },
      },

      "/events/sections/{sectionId}": {
        get: {
          tags: ["Events"],
          summary: "Get events for a section",
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Events retrieved successfully" },
          },
        },
      },

      "/events/{id}": {
        get: {
          tags: ["Events"],
          summary: "Get event by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Event retrieved successfully" },
          },
        },
        patch: {
          tags: ["Events"],
          summary: "Update event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Event updated successfully" },
          },
        },
        delete: {
          tags: ["Events"],
          summary: "Delete event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Event deleted successfully" },
          },
        },
      },
      "/people": {
        post: {
          tags: ["People"],
          summary: "Create a person",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Person created successfully" },
          },
        },
        get: {
          tags: ["People"],
          summary: "Get all people",
          responses: {
            200: { description: "People retrieved successfully" },
          },
        },
      },

      "/people/{id}": {
        get: {
          tags: ["People"],
          summary: "Get person by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Person retrieved successfully" },
            404: { description: "Person not found" },
          },
        },
        patch: {
          tags: ["People"],
          summary: "Update person",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Person updated successfully" },
          },
        },
        delete: {
          tags: ["People"],
          summary: "Delete person",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Person deleted successfully" },
          },
        },
      },
      "/places": {
        post: {
          tags: ["Places"],
          summary: "Create a place",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Place created successfully" },
          },
        },
        get: {
          tags: ["Places"],
          summary: "Get all places",
          responses: {
            200: { description: "Places retrieved successfully" },
          },
        },
      },

      "/places/{id}": {
        get: {
          tags: ["Places"],
          summary: "Get place by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Place retrieved successfully" },
          },
        },
        patch: {
          tags: ["Places"],
          summary: "Update place",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Place updated successfully" },
          },
        },
        delete: {
          tags: ["Places"],
          summary: "Delete place",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Place deleted successfully" },
          },
        },
      },
      "/events/{eventId}/people": {
        post: {
          tags: ["Event Relationships"],
          summary: "Link a person to an event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            201: { description: "Person linked to event" },
            409: { description: "Relationship already exists" },
          },
        },
        get: {
          tags: ["Event Relationships"],
          summary: "Get people linked to an event",
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "People retrieved successfully" },
          },
        },
      },

      "/events/{eventId}/people/{personId}": {
        delete: {
          tags: ["Event Relationships"],
          summary: "Remove a person from an event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
            {
              name: "personId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Person removed from event" },
          },
        },
      },
      "/events/{eventId}/places": {
        post: {
          tags: ["Event Relationships"],
          summary: "Link a place to an event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            201: { description: "Place linked to event" },
            409: { description: "Relationship already exists" },
          },
        },
        get: {
          tags: ["Event Relationships"],
          summary: "Get places linked to an event",
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Places retrieved successfully" },
          },
        },
      },

      "/events/{eventId}/places/{placeId}": {
        delete: {
          tags: ["Event Relationships"],
          summary: "Remove a place from an event",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
            {
              name: "placeId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Place removed from event" },
          },
        },
      },
      "/artifacts": {
        post: {
          tags: ["Artifacts"],
          summary: "Create an artifact",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Artifact created successfully" },
          },
        },
        get: {
          tags: ["Artifacts"],
          summary: "Get all artifacts",
          responses: {
            200: { description: "Artifacts retrieved successfully" },
          },
        },
      },

      "/artifacts/sections/{sectionId}": {
        get: {
          tags: ["Artifacts"],
          summary: "Get artifacts for a section",
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Artifacts retrieved successfully" },
          },
        },
      },

      "/artifacts/{id}": {
        get: {
          tags: ["Artifacts"],
          summary: "Get artifact by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Artifact retrieved successfully" },
          },
        },
        patch: {
          tags: ["Artifacts"],
          summary: "Update artifact",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Artifact updated successfully" },
          },
        },
        delete: {
          tags: ["Artifacts"],
          summary: "Delete artifact",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Artifact deleted successfully" },
          },
        },
      },
      "/media": {
        post: {
          tags: ["Media"],
          summary: "Create media record",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Media created successfully" },
          },
        },
        get: {
          tags: ["Media"],
          summary: "Get all media",
          responses: {
            200: { description: "Media retrieved successfully" },
          },
        },
      },

      "/media/upload": {
        post: {
          tags: ["Media"],
          summary: "Upload media file",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file", "title", "mediaType"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                    },
                    title: {
                      type: "string",
                    },
                    mediaType: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Media uploaded successfully" },
            400: { description: "Invalid upload" },
          },
        },
      },

      "/media/{id}": {
        get: {
          tags: ["Media"],
          summary: "Get media by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media retrieved successfully" },
          },
        },
        patch: {
          tags: ["Media"],
          summary: "Update media",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media updated successfully" },
          },
        },
        delete: {
          tags: ["Media"],
          summary: "Delete media",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media deleted successfully" },
          },
        },
      },
      "/media-attachment": {
        post: {
          tags: ["Media Attachments"],
          summary: "Create a media attachment",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Media attachment created successfully" },
          },
        },
        get: {
          tags: ["Media Attachments"],
          summary: "Get all media attachments",
          responses: {
            200: { description: "Media attachments retrieved successfully" },
          },
        },
      },

      "/media-attachment/{id}": {
        get: {
          tags: ["Media Attachments"],
          summary: "Get media attachment by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media attachment retrieved successfully" },
          },
        },
        patch: {
          tags: ["Media Attachments"],
          summary: "Update media attachment",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media attachment updated successfully" },
          },
        },
        delete: {
          tags: ["Media Attachments"],
          summary: "Delete media attachment",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Media attachment deleted successfully" },
          },
        },
      },
      "/sources": {
        post: {
          tags: ["Sources"],
          summary: "Create a source",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Source created successfully" },
          },
        },
        get: {
          tags: ["Sources"],
          summary: "Get all sources",
          responses: {
            200: { description: "Sources retrieved successfully" },
          },
        },
      },

      "/sources/{id}": {
        get: {
          tags: ["Sources"],
          summary: "Get source by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source retrieved successfully" },
          },
        },
        patch: {
          tags: ["Sources"],
          summary: "Update source",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source updated successfully" },
          },
        },
        delete: {
          tags: ["Sources"],
          summary: "Delete source",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source deleted successfully" },
          },
        },
      },
      "/source-links": {
        post: {
          tags: ["Source Links"],
          summary: "Create a source link",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Source link created successfully" },
          },
        },
        get: {
          tags: ["Source Links"],
          summary: "Get all source links",
          responses: {
            200: { description: "Source links retrieved successfully" },
          },
        },
      },

      "/source-links/{id}": {
        get: {
          tags: ["Source Links"],
          summary: "Get source link by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source link retrieved successfully" },
          },
        },
        patch: {
          tags: ["Source Links"],
          summary: "Update source link",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source link updated successfully" },
          },
        },
        delete: {
          tags: ["Source Links"],
          summary: "Delete source link",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Source link deleted successfully" },
          },
        },
      },
      "/bookmarks": {
        post: {
          tags: ["Bookmarks"],
          summary: "Create a bookmark",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Bookmark created successfully" },
            409: { description: "Artifact already bookmarked" },
          },
        },
        get: {
          tags: ["Bookmarks"],
          summary: "Get current user's bookmarks",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Bookmarks retrieved successfully" },
          },
        },
      },

      "/bookmarks/{id}": {
        get: {
          tags: ["Bookmarks"],
          summary: "Get bookmark by ID",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Bookmark retrieved successfully" },
            404: { description: "Bookmark not found" },
          },
        },
        delete: {
          tags: ["Bookmarks"],
          summary: "Delete bookmark",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Bookmark deleted successfully" },
            404: { description: "Bookmark not found" },
          },
        },
      },
      "/notes": {
        post: {
          tags: ["Notes"],
          summary: "Create a note",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Note created successfully" },
          },
        },
        get: {
          tags: ["Notes"],
          summary: "Get current user's notes",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Notes retrieved successfully" },
          },
        },
      },

      "/notes/{id}": {
        get: {
          tags: ["Notes"],
          summary: "Get note by ID",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Note retrieved successfully" },
          },
        },
        patch: {
          tags: ["Notes"],
          summary: "Update note",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Note updated successfully" },
          },
        },
        delete: {
          tags: ["Notes"],
          summary: "Delete note",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Note deleted successfully" },
          },
        },
      },
      "/progress": {
        post: {
          tags: ["Progress"],
          summary: "Create exhibition progress",
          security: [{ sessionCookie: [] }],
          responses: {
            201: { description: "Progress created successfully" },
            409: { description: "Progress already exists" },
          },
        },
        get: {
          tags: ["Progress"],
          summary: "Get current user's progress",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Progress retrieved successfully" },
          },
        },
      },

      "/progress/{exhibitionId}": {
        get: {
          tags: ["Progress"],
          summary: "Get progress for an exhibition",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "exhibitionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Progress retrieved successfully" },
            404: { description: "Progress not found" },
          },
        },
        patch: {
          tags: ["Progress"],
          summary: "Update exhibition progress",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "exhibitionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Progress updated successfully" },
          },
        },
        delete: {
          tags: ["Progress"],
          summary: "Delete exhibition progress",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "exhibitionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Progress deleted successfully" },
          },
        },
      },
      "/auth/google": {
        post: {
          tags: ["Authentication"],
          summary: "Authenticate with Google",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["credential"],
                  properties: {
                    credential: {
                      type: "string",
                      example: "GOOGLE_ID_TOKEN",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Google authentication successful",
            },
            401: {
              description: "Google authentication failed",
            },
          },
        },
      },
    },

    components: {
      securitySchemes: {
        sessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "sessionId",
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
