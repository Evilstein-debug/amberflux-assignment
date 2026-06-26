import type { RequestHandler } from "express";
import { quoteService } from "../services/quoteService.js";
import type { FindAllFilters } from "../repositories/quoteRepository.js";
import type { QuoteStatus, Priority } from "../../generated/prisma/client.js";

function stringParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const filters: FindAllFilters = {};

        if (typeof req.query["status"] === "string") {
            filters.status = req.query["status"] as QuoteStatus;
        }
        if (typeof req.query["priority"] === "string") {
            filters.priority = req.query["priority"] as Priority;
        }
        if (typeof req.query["search"] === "string") {
            filters.search = req.query["search"];
        }

        res.json(await quoteService.getAllQuotes(filters));
    } catch (err) {
        next(err);
    }
};

export const getById: RequestHandler = async (req, res, next) => {
    try {
        res.json(await quoteService.getQuoteById(stringParam(req.params["id"])));
    } catch (err) {
        next(err);
    }
};

export const createQuote: RequestHandler = async (req, res, next) => {
    try {
        res.status(201).json(await quoteService.createQuote(req.body));
    } catch (err) {
        next(err);
    }
};

export const updateStatus: RequestHandler = async (req, res, next) => {
    try {
        const { status } = req.body as { status: QuoteStatus };
        res.json(
            await quoteService.updateQuoteStatus(stringParam(req.params["id"]), status),
        );
    } catch (err) {
        next(err);
    }
};

export const analyze: RequestHandler = async (req, res, next) => {
    try {
        res.json(await quoteService.analyzeQuote(stringParam(req.params["id"])));
    } catch (err) {
        next(err);
    }
};
