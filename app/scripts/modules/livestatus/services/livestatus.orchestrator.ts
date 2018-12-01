import {Injectable} from "@angular/core";
import {Observable, fromEvent} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { CreatorMessage } from "./livestatus.creator.worker";
import * as $package from "../../../../../package.json";

export type LiveStatusMessage = CreatorMessage;

const NUM_CREATORS: number = $package.config.num_creators;
const NUM_VERIFIERS: number = $package.config.num_verifiers;

@Injectable()
export class LiveStatusOrchestrator {
    private workers: Worker[];
    constructor() {
        this.workers = new Array() as Worker[];
    }
    public spawnCreator(): Observable<CreatorMessage> {
        const creator: Worker = new Worker('/dist/creator.js');
        this.workers.push(creator);
        return fromEvent(creator, 'message')
            .map((event: MessageEvent) => event.data);
    }

    public spawnAllWorkers(): Observable<LiveStatusMessage> {
        let obs$ = new Observable<LiveStatusMessage>();
        for (let i = 0; i < NUM_CREATORS; i++) {
            obs$ = obs$.merge(this.spawnCreator());
        }

        return obs$;
    }

    public cleanup(): void {
        this.workers.forEach((worker) => {
            worker.terminate();
        });
    }
}