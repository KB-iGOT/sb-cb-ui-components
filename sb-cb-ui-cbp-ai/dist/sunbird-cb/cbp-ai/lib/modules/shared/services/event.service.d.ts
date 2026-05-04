import { WsEvents } from './events';
import * as i0 from "@angular/core";
export declare class EventService {
    private eventsChatbotSubject;
    chatbotEvents$: import("rxjs").Observable<WsEvents.IWsEvents<any>>;
    private eventsSubject;
    events$: import("rxjs").Observable<WsEvents.IWsEvents<any>>;
    dispatchChatbotEvent<T>(event: WsEvents.IWsEvents<T>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EventService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EventService>;
}
//# sourceMappingURL=event.service.d.ts.map