import swaggerJsdoc from "swagger-jsdoc";

const authResponseContent = {
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/AuthResponse" },
    },
  },
};

const contentAdminPaths = (tag: string, base: string) => ({
  [`/${base}/admin`]: {
    get: {
      tags: [tag],
      summary: `List all ${base}, including drafts (admin)`,
      security: [{ sessionCookie: [] }],
      responses: {
        200: { description: "Retrieved successfully" },
        403: { description: "Access denied" },
      },
    },
  },
  [`/${base}/admin/{id}`]: {
    get: {
      tags: [tag],
      summary: `Get one of ${base} by ID, any status (admin)`,
      security: [{ sessionCookie: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: { description: "Retrieved successfully" },
        404: { description: "Not found" },
      },
    },
  },
  [`/${base}/{id}/publish`]: {
    patch: {
      tags: [tag],
      summary: "Publish",
      security: [{ sessionCookie: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: { description: "Published successfully" },
        404: { description: "Not found" },
      },
    },
  },
  [`/${base}/{id}/unpublish`]: {
    patch: {
      tags: [tag],
      summary: "Unpublish (back to draft)",
      security: [{ sessionCookie: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: { description: "Unpublished successfully" },
        404: { description: "Not found" },
      },
    },
  },
});

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "REKÒ API",
      version: "1.0.0",
      description: "API for REKÒ, a digital museum of Nigerian history",
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
      ...contentAdminPaths("Events", "events"),
      ...contentAdminPaths("Artifacts", "artifacts"),
      ...contentAdminPaths("People", "people"),
      ...contentAdminPaths("Places", "places"),
      ...contentAdminPaths("Stories", "stories"),

      "/admin/admins": {
        post: {
          tags: ["Authentication"],
          summary: "Create an admin and email a one-time password setup link",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    preferredLanguage: {
                      type: "string",
                      enum: ["en", "yo", "ig", "ha"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Admin created; password setup email sent" },
            409: { description: "Email already exists" },
            403: { description: "Super admin access required" },
          },
        },
      },

      "/auth/admin/setup-password": {
        post: {
          tags: ["Authentication"],
          summary: "Set the password for an invited admin",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token", "password"],
                  properties: {
                    token: { type: "string" },
                    password: {
                      type: "string",
                      format: "password",
                      minLength: 8,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Admin password set successfully" },
            400: { description: "Invalid or expired setup link" },
          },
        },
      },

      "/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Create a visitor account",
          description:
            "A new account returns 201 with OTP_SENT. Existing verified and unverified accounts return 409 with EMAIL_ALREADY_EXISTS or EMAIL_REQUIRES_VERIFICATION. Repeated signup never sends another OTP; use /auth/resend-otp to continue an existing verification.",
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
              description:
                "OTP_SENT. Data includes otpSent, expiresInSeconds, resendAfterSeconds, and nextStep.",
              ...authResponseContent,
            },
            400: {
              description: "Invalid input",
              ...authResponseContent,
            },
            409: {
              description:
                "EMAIL_ALREADY_EXISTS or EMAIL_REQUIRES_VERIFICATION. The data identifies accountVerified and nextStep.",
              ...authResponseContent,
            },
            429: {
              description: "OTP_COOLDOWN or RATE_LIMITED",
              ...authResponseContent,
            },
            503: {
              description: "OTP_DELIVERY_FAILED or RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
              description: "EMAIL_VERIFIED",
              ...authResponseContent,
            },
            400: {
              description: "INVALID_OTP, OTP_EXPIRED, or VALIDATION_ERROR",
              ...authResponseContent,
            },
            429: {
              description: "OTP_ATTEMPTS_EXCEEDED or RATE_LIMITED",
              ...authResponseContent,
            },
            503: {
              description: "RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
              description: "LOGIN_SUCCESS",
              ...authResponseContent,
            },
            401: {
              description: "INVALID_CREDENTIALS",
              ...authResponseContent,
            },
            403: {
              description: "EMAIL_NOT_VERIFIED",
              ...authResponseContent,
            },
            503: {
              description: "RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
              description:
                "OTP_REQUEST_ACCEPTED. Response is intentionally generic to avoid account enumeration.",
              ...authResponseContent,
            },
            400: {
              description: "Invalid request",
              ...authResponseContent,
            },
            429: {
              description:
                "OTP_COOLDOWN or RATE_LIMITED. OTP_COOLDOWN data includes retryAfterSeconds.",
              ...authResponseContent,
            },
            503: {
              description: "OTP_DELIVERY_FAILED or RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
              description:
                "PASSWORD_RESET_REQUEST_ACCEPTED. Response data is identical for unknown emails, cooldowns, and eligible accounts.",
              ...authResponseContent,
            },
            429: { description: "RATE_LIMITED", ...authResponseContent },
            503: {
              description: "RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
              description: "PASSWORD_RESET",
              ...authResponseContent,
            },
            400: {
              description: "INVALID_OTP, OTP_EXPIRED, or VALIDATION_ERROR",
              ...authResponseContent,
            },
            429: {
              description: "OTP_ATTEMPTS_EXCEEDED or RATE_LIMITED",
              ...authResponseContent,
            },
            503: {
              description: "RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
            },
          },
        },
      },

      "/auth/change-password": {
        post: {
          tags: ["Authentication"],
          summary: "Change the current user's password",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string", format: "password" },
                    newPassword: { type: "string", format: "password" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "PASSWORD_CHANGED",
              ...authResponseContent,
            },
            400: {
              description: "CURRENT_PASSWORD_INCORRECT or VALIDATION_ERROR",
              ...authResponseContent,
            },
            401: {
              description: "Authentication required",
              ...authResponseContent,
            },
            429: {
              description: "RATE_LIMITED",
              ...authResponseContent,
            },
            503: {
              description: "RATE_LIMIT_STORE_UNAVAILABLE",
              ...authResponseContent,
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
          summary: "Get public exhibition previews",
          description:
            "Returns published exhibition cover and introductory information.",
          responses: {
            200: { description: "Exhibitions retrieved successfully" },
          },
        },
      },

      "/exhibitions/{slug}": {
        get: {
          tags: ["Exhibitions"],
          summary: "Get a public exhibition preview by slug",
          description:
            "Returns the exhibition cover and introduction.",
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
      "/experiences/{slug}": {
        get: {
          tags: ["Experiences"],
          summary:
            "Get an exhibition experience with its ordered sections",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Experience retrieved successfully" },
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
            200: { description: "Sections retrieved successfully" },
          },
        },
      },

      "/sections/admin/exhibitions/{exhibitionId}": {
        get: {
          tags: ["Sections"],
          summary:
            "Get all sections of an exhibition, even if it is a draft (admin)",
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
            200: { description: "Sections retrieved successfully" },
          },
        },
      },

      "/sections/{id}": {
        get: {
          tags: ["Sections"],
          summary: "Get section by ID",
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
        get: {
          tags: ["Stories"],
          summary: "Get all published stories",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Stories retrieved successfully" },
          },
        },
        post: {
          tags: ["Stories"],
          summary: "Create a story, optionally in a section",
          description:
            "Omit sectionId to create a standalone story. If supplied, sectionId must be a positive integer.",
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
          security: [{ sessionCookie: [] }],
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

      "/stories/did-you-know": {
        get: {
          tags: ["Stories"],
          summary:
            "Get the story of the day for the home page's Did you know section (data is null when none is ready)",
          responses: {
            200: { description: "Did you know story retrieved successfully" },
          },
        },
      },

      "/stories/{id}": {
        patch: {
          tags: ["Stories"],
          summary: "Update story",
          description:
            "Omit sectionId to keep the current section. Set sectionId to null to make the story standalone.",
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
      "/stories/{slug}": {
        get: {
          tags: ["Stories"],
          summary: "Get a published story by slug",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Story retrieved successfully" },
            404: { description: "Story not found" },
          },
        },
      },
      "/stories/admin/sections/{sectionId}": {
        get: {
          tags: ["Stories"],
          summary: "Get published stories by section (admin)",
          security: [{ sessionCookie: [] }],
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
            403: { description: "Access denied" },
          },
        },
      },
      "/events": {
        get: {
          tags: ["Events"],
          summary: "Get all published events",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Events retrieved successfully" },
          },
        },
        post: {
          tags: ["Events"],
          summary: "Create an event, optionally in a section",
          description:
            "Create an event independently by omitting sectionId or setting it to null, or include a positive integer sectionId to place it in an exhibition section.",
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
          security: [{ sessionCookie: [] }],
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
            200: { description: "Event retrieved successfully" },
          },
        },
        patch: {
          tags: ["Events"],
          summary: "Update an event or its section relationship",
          description:
            "Omit sectionId to leave the existing relationship unchanged. Set sectionId to null to make the event standalone.",
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
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "People retrieved successfully" },
          },
        },
      },

      "/people/{id}": {
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
      "/people/{slug}": {
        get: {
          tags: ["People"],
          summary: "Get a published person by slug",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Person retrieved successfully" },
            404: { description: "Person not found" },
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
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Places retrieved successfully" },
          },
        },
      },

      "/places/{id}": {
        get: {
          tags: ["Places"],
          summary: "Get place by ID",
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
      "/admin/events/{eventId}/people": {
        get: {
          tags: ["Event Relationships"],
          summary: "Get all people linked to an event, including drafts (admin)",
          description:
            "Returns complete person records for the event, including draft people, even when the event itself is a draft. An existing event with no linked people returns an empty data array.",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer", minimum: 1 },
            },
          ],
          responses: {
            200: {
              description: "Linked people retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PeopleResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidId" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/EventNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/events/{eventId}/people": {
        post: {
          tags: ["Event Relationships"],
          summary: "Link a person to an event",
          description:
            "The JSON request uses personId in camelCase. The returned relationship row uses event_id and person_id in snake_case.",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LinkEventPersonRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Person linked to event",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventPersonLinkResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidRelationshipInput" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/ReferencedResourceNotFound" },
            409: { $ref: "#/components/responses/RelationshipAlreadyExists" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
        get: {
          tags: ["Event Relationships"],
          summary: "Get people linked to an event",
          description:
            "Returns published people only when the event is publicly visible. The data array contains complete person records.",
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "People retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PeopleResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/events/{eventId}/people/{personId}": {
        delete: {
          tags: ["Event Relationships"],
          summary: "Remove a person from an event",
          description:
            "Deletes the relationship only; it does not delete the person or event.",
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
            200: {
              description: "Person removed from event",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventPersonLinkResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidId" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/RelationshipNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/admin/events/{eventId}/places": {
        get: {
          tags: ["Event Relationships"],
          summary: "Get all places linked to an event, including drafts (admin)",
          description:
            "Returns complete place records for the event, including draft places, even when the event itself is a draft. An existing event with no linked places returns an empty data array.",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer", minimum: 1 },
            },
          ],
          responses: {
            200: {
              description: "Linked places retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PlacesResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidId" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/EventNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },
      "/events/{eventId}/places": {
        post: {
          tags: ["Event Relationships"],
          summary: "Link a place to an event",
          description:
            "The JSON request uses placeId in camelCase. The returned relationship row uses event_id and place_id in snake_case.",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LinkEventPlaceRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Place linked to event",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventPlaceLinkResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidRelationshipInput" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/ReferencedResourceNotFound" },
            409: { $ref: "#/components/responses/RelationshipAlreadyExists" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
        get: {
          tags: ["Event Relationships"],
          summary: "Get places linked to an event",
          description:
            "Returns published places only when the event is publicly visible. The data array contains complete place records.",
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Places retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PlacesResponse",
                  },
                },
              },
            },
          },
        },
      },

      "/events/{eventId}/places/{placeId}": {
        delete: {
          tags: ["Event Relationships"],
          summary: "Remove a place from an event",
          description:
            "Deletes the relationship only; it does not delete the place or event.",
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
            200: {
              description: "Place removed from event",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventPlaceLinkResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidId" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/RelationshipNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
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
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Artifacts retrieved successfully" },
          },
        },
      },

      "/artifacts/sections/{sectionId}": {
        get: {
          tags: ["Artifacts"],
          summary: "Get artifacts for a section",
          security: [{ sessionCookie: [] }],
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
      "/artifacts/{slug}": {
        get: {
          tags: ["Artifacts"],
          summary: "Get a published artifact by slug",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Artifact retrieved successfully" },
            404: { description: "Artifact not found" },
          },
        },
      },
      "/search": {
        get: {
          tags: ["Search"],
          summary: "Search published content",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Search results retrieved" },
            400: { description: "Query too short" },
          },
        },
      },
      "/media": {
        post: {
          tags: ["Media"],
          summary: "Create media record",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateMediaRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Media created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MediaResponse" },
                },
              },
            },
          },
        },
        get: {
          tags: ["Media"],
          summary: "Get all media",
          security: [{ sessionCookie: [] }],
          responses: {
            200: {
              description: "Media retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MediaListResponse" },
                },
              },
            },
          },
        },
      },

      "/media/youtube": {
        post: {
          tags: ["Media"],
          summary: "Add a YouTube video",
          description:
            "Validates supported YouTube watch, short, shorts, live, and embed URLs. Stores the canonical watch URL as a video media record and returns a privacy-enhanced embed URL.",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateYouTubeMediaRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "YouTube video added successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MediaResponse" },
                },
              },
            },
            400: {
              description: "Invalid request or unsupported YouTube URL.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },

      "/admin/events/{eventId}/media": {
        get: {
          tags: ["Media"],
          summary: "Get media attached to an event, including drafts (admin)",
          description:
            "Returns attached media records for draft or published events, including YouTube embed metadata. An existing event with no media returns an empty data array. attachment_id identifies the relationship for deletion.",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "eventId",
              in: "path",
              required: true,
              schema: { type: "integer", minimum: 1 },
            },
          ],
          responses: {
            200: {
              description: "Event media retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventMediaListResponse",
                  },
                },
              },
            },
            400: { $ref: "#/components/responses/InvalidId" },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/EventNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },

      "/media/upload": {
        post: {
          tags: ["Media"],
          summary: "Upload an image, document, audio, or video file",
          description:
            "Uploads to R2. MP4 and WebM are accepted for video; the maximum file size is 10 MB. mediaType is inferred from the file MIME type and must not be sent.",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file", "title"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                    },
                    title: {
                      type: "string",
                    },
                    caption: {
                      type: "string",
                    },
                    description: { type: "string" },
                    sourceCredit: { type: "string" },
                    license: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Media uploaded successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MediaResponse" },
                },
              },
            },
            400: {
              description: "Invalid upload or unsupported file type.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
      },

      "/media/{id}": {
        get: {
          tags: ["Media"],
          summary: "Get media by ID",
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
            200: {
              description: "Media retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MediaResponse" },
                },
              },
            },
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
          description:
            "Attach a media record to an event or another content record. For an event, send mediaId and eventId; eventId is optional when attaching to other supported content.",
          security: [{ sessionCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateMediaAttachmentRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Media attachment created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/MediaAttachmentResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid media or content ID.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: { $ref: "#/components/responses/AuthenticationRequired" },
            403: { $ref: "#/components/responses/AccessDenied" },
            404: { $ref: "#/components/responses/ReferencedResourceNotFound" },
            500: { $ref: "#/components/responses/InternalServerError" },
          },
        },
        get: {
          tags: ["Media Attachments"],
          summary: "Get all media attachments",
          security: [{ sessionCookie: [] }],
          responses: {
            200: { description: "Media attachments retrieved successfully" },
          },
        },
      },

      "/media-attachment/{id}": {
        get: {
          tags: ["Media Attachments"],
          summary: "Get media attachment by ID",
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
      "/source-links/content/{targetType}/{targetId}": {
        get: {
          tags: ["Source Links"],
          summary:
            "Get sources for content",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "targetType",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "section",
                  "story",
                  "event",
                  "person",
                  "place",
                  "artifact",
                ],
              },
            },
            {
              name: "targetId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Content sources retrieved" },
          },
        },
      },
      "/sections/{sectionId}/people": {
        get: {
          tags: ["Content Relationships"],
          summary:
            "Get people featured in a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Section people retrieved" },
          },
        },
        post: {
          tags: ["Content Relationships"],
          summary: "Feature a person in a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { 201: { description: "Person linked to section" } },
        },
      },
      "/sections/{sectionId}/people/{personId}": {
        delete: {
          tags: ["Content Relationships"],
          summary: "Remove a person from a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
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
          responses: { 200: { description: "Person unlinked from section" } },
        },
      },
      "/admin/sections/{sectionId}/people": {
        get: {
          tags: ["Content Relationships"],
          summary: "Get all people linked to a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { 200: { description: "Section people retrieved" } },
        },
      },
      "/sections/{sectionId}/places": {
        get: {
          tags: ["Content Relationships"],
          summary:
            "Get places featured in a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Section places retrieved" },
          },
        },
        post: {
          tags: ["Content Relationships"],
          summary: "Feature a place in a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { 201: { description: "Place linked to section" } },
        },
      },
      "/sections/{sectionId}/places/{placeId}": {
        delete: {
          tags: ["Content Relationships"],
          summary: "Remove a place from a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
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
          responses: { 200: { description: "Place unlinked from section" } },
        },
      },
      "/admin/sections/{sectionId}/places": {
        get: {
          tags: ["Content Relationships"],
          summary: "Get all places linked to a section",
          security: [{ sessionCookie: [] }],
          parameters: [
            {
              name: "sectionId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { 200: { description: "Section places retrieved" } },
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
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            code: {
              type: "string",
              description: "Stable machine-readable code when provided.",
            },
            data: {
              type: "object",
              nullable: true,
              description: "Additional response or error details, when present.",
            },
          },
        },
        AuthResponse: {
          type: "object",
          required: ["code", "message", "data"],
          properties: {
            code: { type: "string" },
            message: { type: "string" },
            data: { type: "object", nullable: true },
          },
        },
        PersonRecord: {
          type: "object",
          description: "Person record returned with database column names in snake_case.",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string", nullable: true },
            birth_date: { type: "string", format: "date", nullable: true },
            death_date: { type: "string", format: "date", nullable: true },
            status: { type: "string", enum: ["draft", "published", "archived"] },
            published_at: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        PlaceRecord: {
          type: "object",
          description: "Place record returned with database column names in snake_case.",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            latitude: {
              type: "string",
              nullable: true,
              description: "Decimal coordinate serialized by PostgreSQL as a string.",
            },
            longitude: {
              type: "string",
              nullable: true,
              description: "Decimal coordinate serialized by PostgreSQL as a string.",
            },
            status: { type: "string", enum: ["draft", "published", "archived"] },
            published_at: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        PeopleResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/PersonRecord" },
            },
          },
        },
        PlacesResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/PlaceRecord" },
            },
          },
        },
        LinkEventPersonRequest: {
          type: "object",
          required: ["personId"],
          properties: {
            personId: { type: "integer", minimum: 1 },
          },
        },
        LinkEventPlaceRequest: {
          type: "object",
          required: ["placeId"],
          properties: {
            placeId: { type: "integer", minimum: 1 },
          },
        },
        EventPersonLink: {
          type: "object",
          required: ["event_id", "person_id"],
          properties: {
            event_id: { type: "integer" },
            person_id: { type: "integer" },
          },
        },
        EventPlaceLink: {
          type: "object",
          required: ["event_id", "place_id"],
          properties: {
            event_id: { type: "integer" },
            place_id: { type: "integer" },
          },
        },
        EventPersonLinkResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: { $ref: "#/components/schemas/EventPersonLink" },
          },
        },
        EventPlaceLinkResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: { $ref: "#/components/schemas/EventPlaceLink" },
          },
        },
        CreateMediaRequest: {
          type: "object",
          required: ["title", "mediaType", "fileUrl"],
          properties: {
            title: { type: "string" },
            mediaType: {
              type: "string",
              enum: ["image", "document", "audio", "video"],
            },
            fileUrl: { type: "string", format: "uri" },
            caption: { type: "string" },
            description: { type: "string" },
            sourceCredit: { type: "string" },
            license: { type: "string" },
          },
        },
        CreateYouTubeMediaRequest: {
          type: "object",
          required: ["title", "youtubeUrl"],
          properties: {
            title: { type: "string", minLength: 2, maxLength: 255 },
            youtubeUrl: {
              type: "string",
              format: "uri",
              description:
                "YouTube watch, youtu.be, shorts, live, or embed URL.",
            },
            caption: { type: "string" },
            description: { type: "string" },
            sourceCredit: { type: "string", maxLength: 500 },
            license: { type: "string", maxLength: 255 },
          },
        },
        MediaRecord: {
          type: "object",
          description:
            "Media fields use snake_case. For uploaded video files, embed_url is null and file_url is the video URL; for YouTube videos, video_provider is youtube and embed_url is a privacy-enhanced embed URL.",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            media_type: {
              type: "string",
              enum: ["image", "document", "audio", "video"],
            },
            file_url: { type: "string", format: "uri" },
            caption: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            source_credit: { type: "string", nullable: true },
            license: { type: "string", nullable: true },
            video_provider: {
              type: "string",
              enum: ["youtube"],
              nullable: true,
            },
            embed_url: { type: "string", format: "uri", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        MediaResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: { $ref: "#/components/schemas/MediaRecord" },
          },
        },
        MediaListResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/MediaRecord" },
            },
          },
        },
        EventMediaRecord: {
          allOf: [
            { $ref: "#/components/schemas/MediaRecord" },
            {
              type: "object",
              required: ["attachment_id", "display_order"],
              properties: {
                attachment_id: { type: "integer" },
                display_order: { type: "integer" },
              },
            },
          ],
        },
        EventMediaListResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/EventMediaRecord" },
            },
          },
        },
        CreateMediaAttachmentRequest: {
          type: "object",
          required: ["mediaId"],
          properties: {
            mediaId: { type: "integer", minimum: 1 },
            exhibitionId: { type: "integer", minimum: 1 },
            sectionId: { type: "integer", minimum: 1 },
            eventId: { type: "integer", minimum: 1 },
            personId: { type: "integer", minimum: 1 },
            placeId: { type: "integer", minimum: 1 },
            artifactId: { type: "integer", minimum: 1 },
            displayOrder: { type: "integer", minimum: 0, default: 0 },
          },
        },
        MediaAttachmentRecord: {
          type: "object",
          properties: {
            id: { type: "integer" },
            media_id: { type: "integer" },
            exhibition_id: { type: "integer", nullable: true },
            section_id: { type: "integer", nullable: true },
            event_id: { type: "integer", nullable: true },
            person_id: { type: "integer", nullable: true },
            place_id: { type: "integer", nullable: true },
            artifact_id: { type: "integer", nullable: true },
            display_order: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        MediaAttachmentResponse: {
          type: "object",
          required: ["message", "data"],
          properties: {
            message: { type: "string" },
            data: { $ref: "#/components/schemas/MediaAttachmentRecord" },
          },
        },
      },
      responses: {
        InvalidId: {
          description: "Path ID must be a positive integer.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        InvalidRelationshipInput: {
          description: "Request body contains an invalid relationship ID.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        AuthenticationRequired: {
          description: "Authentication is required.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        AccessDenied: {
          description: "The authenticated user does not have an admin role.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        EventNotFound: {
          description: "No event exists with the supplied ID.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ReferencedResourceNotFound: {
          description: "The event or person/place does not exist.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        RelationshipAlreadyExists: {
          description: "The relationship already exists.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        RelationshipNotFound: {
          description: "The event-person or event-place relationship does not exist.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        InternalServerError: {
          description: "Unexpected server error.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;