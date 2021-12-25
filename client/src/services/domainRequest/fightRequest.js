import { getAll, post } from "../requestHelper";

const entity = "fights";

export const createFight = (body) => {
    return post(entity, body);
};

export const getAllFights = () => {
    return getAll(entity);
};

