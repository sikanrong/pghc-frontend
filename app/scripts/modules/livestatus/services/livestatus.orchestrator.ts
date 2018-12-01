import {Injectable} from "@angular/core";
import {Observable, fromEvent} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { CreatorMessage } from "./livestatus.creator.worker";
import * as $package from "../../../../../package.json";
import {VerifierMessage} from "./livestatus.verifier.worker";

export enum LiveStatusMessageType {
    creator,
    verifier
}
export interface LiveStatusMessage {
    parentType: LiveStatusMessageType;
    type: any;
    payload: any;
}

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

    public spawnVerifier(): Observable<VerifierMessage> {
        const verifier: Worker = new Worker('/dist/verifier.js');
        this.workers.push(verifier);
        return fromEvent(verifier, 'message')
            .map((event: MessageEvent) => event.data);
    }

    public spawnAllWorkers(): Observable<LiveStatusMessage> {
        let obs$ = new Observable<LiveStatusMessage>();
        for (let i = 0; i < NUM_CREATORS; i++) {
            obs$ = obs$.merge(this.spawnCreator());
        }

        for (let i = 0; i < NUM_VERIFIERS; i++) {
            obs$ = obs$.merge(this.spawnVerifier());
        }

        return obs$;
    }

    public cleanup(): void {
        this.workers.forEach((worker) => {
            worker.terminate();
        });
    }
}