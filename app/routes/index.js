"use strict";

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const authRouter = require("./auth");
const familyRouter = require("./family");

const router = express.Router();
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/families", familyRouter);

router.use("/api", apiRouter);

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gamelimiter API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            Id: {
              type: "string",
            },
            UserName: {
              type: "string",
            },
            Email: {
              type: "string",
            },
            PhoneNumber: {
              type: "string",
            },
            AccessFailedCount: {
              type: "integer",
            },
            avatar: {
              type: "string",
            },
            role: {
              type: "string",
            },
            isOwner: {
              type: "boolean",
            },
          },
        },
        FamilyUserRole: {
          type: "string",
          enum: ["Child", "Parent", "Admin"],
        },
        FamilyMember: {
          type: "object",
          description: "A FamilyMember is an User but with limited data access",
          properties: {
            Id: {
              type: "string",
            },
            UserName: {
              type: "string",
            },
            Email: {
              type: "string",
            },
            PhoneNumber: {
              type: "string",
            },
            avatar: {
              type: "string",
            },
            role: {
              $ref: "#/components/schemas/FamilyUserRole",
            },
            progress: {
              type: "number",
              description:
                "A random number between 0 and 1 to simulate progress",
            },
          },
        },
        Meta: {
          type: "object",
          properties: {
            token: {
              type: "string",
            },
            payload: {
              type: "object",
              properties: {
                Id: {
                  type: "string",
                },
                Email: {
                  type: "string",
                },
                exp: {
                  type: "integer",
                },
                iat: {
                  type: "integer",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./app/routes/*.js"],
});

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
