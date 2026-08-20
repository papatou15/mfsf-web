"use client"

import Typography from "./Typography/Typography";
import typographyTheme from "./theme/Typography";
import { AdminTeamMember } from "@/sanity.types";

interface AdminTeamMemberCardProps {
    adminTeamMember: NonNullable<AdminTeamMember["members"]>[number]; // Correct type for individual admin team members.
}

export const AdminTeamMemberCard = ({ adminTeamMember }: AdminTeamMemberCardProps) => {
    const borderColors = ["border-primary-blue", "border-primary-green", "border-primary-orange", "border-primary-red"];
    const borderIndex = Array.from(adminTeamMember.name ?? "").reduce((sum, character) => sum + character.charCodeAt(0), 0) % borderColors.length;
    const borderColor = borderColors[borderIndex];

    return (
        <div className={`w-[480px] h-56 m-10 bg-custom-beige flex flex-col items-center justify-center gap-3 text-center rounded-2xl shadow-big-box-bg p-8 border-4 ${borderColor}`}>
            <Typography as={"h5"} className={`w-full text-center shadow-text-sm ${typographyTheme({ size: 'h3' })}`}>
                {adminTeamMember.name}
            </Typography>
            <Typography as={"p"} className={`w-full text-center text-[#7b7b7b] italic ${typographyTheme({ size: 'h6' })}`}>
                {adminTeamMember.role}
            </Typography>
        </div>
    )
}
