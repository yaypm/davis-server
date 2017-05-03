import { IDavisRequest } from "../../core/interfaces";
import { Plugin } from "../../core/plugin";

export class UserActivity extends Plugin {
    public readonly name = "userActivity";

    public async ask(req: IDavisRequest) {
        return { text: "this is a user activity." };
    }
}
