import type { IconType } from "react-icons";

type SocialLinkProps = {
    href: string;
    icon: IconType;
    name: string;
};

export default function SocialLink({
    href,
    icon: Icon,
    name,
}: SocialLinkProps) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon size={30} />
            <span>{name}</span>
        </a>
    );
}