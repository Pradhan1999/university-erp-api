import express from "express";
import { db } from "../db";
import { departments, subjects } from "../db/schema";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

const router = express.Router();

// GET all subjects with optional search, pagination, and filtering
router.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10, departmentName } = req.query;

    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
    const limitPerPage = Math.max(1, parseInt(String(limit), 10) || 10);

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    // search subject by name or code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    // filter by department name
    if (departmentName) {
      // protect against SQL injection by escaping special characters in the department name
      const sanitizedDepartmentName = String(departmentName)
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_");
        
      filterConditions.push(
        ilike(departments.name, `%${sanitizedDepartmentName}%`),
      );
    }

    // combine all filter conditions
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    // A LEFT JOIN is used to combine rows from two tables, returning all rows from the left (first) table and matching rows from the right (second) table.
    // ➡️ This query returns the `total number of subjects` that match the given filters (including department name if provided).
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        total: totalCount,
        page: currentPage,
        limit: limitPerPage,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// POST api to create a new subject
router.post("/", async (req, res) => {
  try {
    const { name, code, departmentId, description } = req.body;
    if (!name || !code || !departmentId) {
      return res
        .status(400)
        .json({ error: "Name, code, and departmentId are required" });
    }
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

export default router;
