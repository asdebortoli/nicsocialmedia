import Image from "next/image";

export function Background() {
    return (
        <div>
            <Image
                src="/left-bg.svg"
                alt=""
                width={387}
                height={222}
                className="pointer-events-none absolute -left-50 md:left-0 top-96 z-0"
                aria-hidden="true"
            />
            <Image
                src="/right-bg.svg"
                alt=""
                width={600}
                height={234}
                className="pointer-events-none absolute -right-50 md:right-0 top-50 z-0"
                aria-hidden="true"
            />
        </div>
    );
}