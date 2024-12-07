import { Request, Response } from "express";
import * as Yup from "yup";
import { StatusCodes } from "http-status-codes";

import { Project, ProjectManager } from "../entity";
import { Brackets } from "typeorm";

const { BAD_REQUEST, OK } = StatusCodes;

const returnSortingKey = (key: string) => {
  if (key === "project_manager_name") {
    return "pm.name";
  }

  return `project.${key}`;
};

//@desc Get projects list
//@route POST /api/projects
//@access Public
export const list = async (req: Request, res: Response) => {
  try {
    const {
      searchQuery = "",
      pagination = {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting = [
        {
          id: "id",
          desc: false,
        },
      ],
      filters = [],
    } = req.body;

    const schema = Yup.object().shape({
      pagination: Yup.object()
        .shape({
          pageIndex: Yup.number().required(),
          pageSize: Yup.number().required(),
        })
        .required(),
      sorting: Yup.array().of(
        Yup.object()
          .shape({
            id: Yup.string()
              .required()
              .oneOf([
                "id",
                "name",
                "status",
                "estimated_cost",
                "project_manager_name",
                "last_updated",
              ]),
            desc: Yup.boolean().required(),
          })
          .required()
      ),
      filters: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required().oneOf(["status"]),
          value: Yup.string().required(),
        })
      ),
    });

    await schema.validate({ pagination, sorting });

    const projectQuery = Project.createQueryBuilder(
      "project"
    ).leftJoinAndMapOne(
      "project.project_manager",
      ProjectManager,
      "pm",
      "pm.id = project.project_manager_id"
    );

    console.log("filters", filters);

    if (filters.length > 0) {
      for (const filter of filters) {
        if (filter.id === "status" && filter.value === "all") {
          continue;
        }

        if (filter.id === "status") {
          projectQuery.andWhere("project.status ILIKE :filterValue", {
            filterValue: `${filter.value}`,
          });
        } else {
          projectQuery.andWhere(
            `${returnSortingKey(filter.id)} ILIKE :filterValue`,
            {
              filterValue: `%${filter.value}%`,
            }
          );
        }
      }
    }

    if (searchQuery && searchQuery !== "") {
      projectQuery.andWhere(
        new Brackets((qb) => {
          qb.where("project.name ILIKE :searchQuery", {
            searchQuery: `%${searchQuery}%`,
          })
            .orWhere("project.status ILIKE :searchQuery", {
              searchQuery: `%${searchQuery}%`,
            })
            .orWhere("pm.name ILIKE :searchQuery", {
              searchQuery: `%${searchQuery}%`,
            })
            .orWhere("pm.email ILIKE :searchQuery", {
              searchQuery: `%${searchQuery}%`,
            });
        })
      );
    }

    if (sorting.length > 0) {
      projectQuery.orderBy(
        returnSortingKey(sorting[0].id),
        sorting[0].desc ? "DESC" : "ASC"
      );

      for (let i = 1; i < sorting.length; i++) {
        projectQuery.addOrderBy(
          returnSortingKey(sorting[i].id),
          sorting[i].desc ? "DESC" : "ASC"
        );
      }
    } else {
      projectQuery.orderBy("project.id", "ASC");
    }

    const projects = await projectQuery
      .skip(pagination.pageIndex * pagination.pageSize)
      .take(pagination.pageSize)
      .getMany();

    const totalCount = await projectQuery.getCount();

    const riskProjectsCount = await projectQuery
      .andWhere("project.status = :status", { status: "risk" })
      .getCount();

    const onHoldProjectsCount = await projectQuery
      .andWhere("project.status = :status", { status: "onHold" })
      .getCount();

    const potentialRiskProjectsCount = await projectQuery
      .andWhere("project.status = :status", { status: "potentialRisk" })
      .getCount();

    const onTrackProjectsCount = await projectQuery
      .andWhere("project.status = :status", { status: "onTrack" })
      .getCount();

    const archivedProjectsCount = await projectQuery
      .andWhere("project.status = :status", { status: "archived" })
      .getCount();

    res.status(OK).json({
      status: "success",
      message: "Projects list",
      data: {
        totalCount,
        projects,
        counts: {
          risk: riskProjectsCount,
          onHold: onHoldProjectsCount,
          potentialRisk: potentialRiskProjectsCount,
          onTrack: onTrackProjectsCount,
          archived: archivedProjectsCount,
        },
      },
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};
