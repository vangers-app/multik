import { useState } from "preact/hooks";
import { lang, t } from "./i18n";
import { AppProps, CreateEventRequest, MultiplayerGame } from "./props";
import { nanoid } from "nanoid";

const minDuration = 30 * 60 * 1000;
const durationStep = minDuration;
const maxDuration = 2 * 60 * 60 * 1000;

export function CreateEvent(props: AppProps & {
    request: CreateEventRequest,
    class?: string,
}) {
    const config = props.config;
    const { calendar } = props.request;
    const [gameId, setGameType] = useState<string>(config.games[0].id);
    const game = config.games.find((g) => g.id === gameId) as MultiplayerGame;
    const [start, setStart] = useState<number>(props.request.start.getTime());
    const [duration, setDuration] = useState<number>(game.durationMs);

    function onCancle() {
        calendar.clearGridSelections();
        props.cancleRequest();
    }

    function onCreate() {
        calendar.clearGridSelections();
        calendar.createEvents([{
            id: game.id + "@" + nanoid(),
            calendarId: game.id,
            start: newDate(start),
            end: newDate(start + duration),
            backgroundColor: game.color,
            color: game.textColor,
        }]);
        props.cancleRequest();
    }

    function incDuration() {
        setDuration(Math.min(duration + durationStep, maxDuration));
    }

    function decDuration() {
        setDuration(Math.max(duration - durationStep, minDuration));
    }

    function incTime() {
        setStart(start + durationStep);
    }

    function decTime() {
        setStart(start - durationStep);
    }

    return <div class={props.class + " bg-white opacity-95"}>
        <div class="flex flex-col mx-10 my-8">
            <div class="text-2xl mb-4">{t("create_event")}</div>

            <div class="flex flex-row">
                <div class="w-16">{t("from")}</div>
                <div class="ml-6 text-green-800 font-bold">{newDate(start).toLocaleString()}</div>
                <IncDec onInc={incTime} onDec={decTime} />
            </div>
            <div class="flex flex-ro mt-2">
                <div class="w-16">{t("duration")}</div>
                <div class="ml-6 font-bold">{humanizeTime(duration)}</div>
                <IncDec onInc={incDuration} onDec={decDuration} />
            </div>

            <div class="text-xl my-4">{t("game")}</div>
            <div class="my-2 flex flex-row items-center">
                <div class="mr-4 w-20">{t("game_type")}</div>
                <select value={gameId} onChange={(e) => setGameType((e.target as any).value)}
                    class="border border-blue-300 rounded py-1 px-1">
                    {config.games.map((game) => {
                        return <option key={game.id} value={game.id}>{game.name[lang] ?? game.name["en"]}</option>;
                    })};
                </select>
                {game.color && <div class="ml-2 w-4 h-4" style={{ backgroundColor: game.color }}></div>}
            </div>

            {game.description && <div class="text-sm text-gray-600 ml-4 -mt-1 mb-2 flex flex-row">
                <span class="mr-2">*</span>
                <span>{game.description[lang] ?? game.description["en"]}</span>
            </div>}

            <TextInput label={t("name")} value={""} />
            <TextInput label={t("link")} value={""} />
            <TextInput label={t("comment")} value={""} />

            <div class="flex flex-row my-4">
                <div class="flex-grow" />
                <div class="bg-gray-400 px-4 py-2 mr-8 rounded" onClick={onCancle}>{t("cancle")}</div>
                <div class="bg-green-400 px-16 py-2 rounded" onClick={onCreate}>{t("create")}</div>
            </div>
        </div>
    </div>;
}

function TextInput(props: {
    label: string,
    value: string,
}) {
    return <div class="flex flex-row my-2 items-center">
        <div class="mr-4 w-20">{props.label}</div>
        <input class="border border-blue-300 rounded px-1 py-1 w-full" value={props.value}></input>
    </div>;
}

function humanizeTime(ms: number) {
    const timeSec = Math.round(ms / 1000);
    if (timeSec > 24 * 60 * 60) {
        const days = Math.round(timeSec / 24 / 60 / 60 * 10) / 10;
        return days + (days === 1 ? " Day" : " Days");
    }

    if (timeSec > 60 * 60) {
        const hours = Math.round(timeSec / 60 / 60 * 10) / 10;
        return hours + (hours === 1 ? " Hour" : " Hrs");
    }

    const minutes = Math.round(timeSec / 60 * 10) / 10;
    return minutes + " Min";
}

function IncDec(props: {
    onInc: () => void,
    onDec: () => void,
}) {
    return <>
        <div class="ml-2" onClick={props.onInc}>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </div>
        <div class="ml-2" onClick={props.onDec}>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </div>
    </>;
}

function newDate(ms: number) {
    return new Date(ms);
}