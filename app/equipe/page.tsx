/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import { MissionImage, TeamMember, AdminTeamMember, Temoignages } from "@/sanity.types";
import { queryFetcher, aboutPageQuery } from "../queries";
import sanityImgUrl from "../sanityImageBuilder";
import { EmployeeCard } from "../components/EmployeeCard";
import { AdminTeamMemberCard } from "../components/adminTeamMemberCard";
import Link from "next/link";

export default async function Equipe() {

    const data = await queryFetcher(aboutPageQuery);
    const fetchedTeamMembers = data.find((document: { _type: string }) => document._type === "teamMember") as TeamMember;
    const fetchedAdminTeamMembers = data.find((document: { _type: string }) => document._type === "adminTeamMember") as AdminTeamMember;
    const fetchedImage = data.find((document: { _type: string }) => document._type === "missionImage") as MissionImage & {
        aboutText?: string;
        memberBenefits?: string[];
    };
    const fetchedTemoignages = data.find((document: { _type: string }) => document._type === "temoignages") as Temoignages;

    return (
        <>
            <div className="flex flex-col items-center my-16">
                <Typography as="h1" className={`flex justify-center font-semibold text-center ${typographyTheme({ size: 'h1' })}`}>
                    NOTRE MISSION
                </Typography>
                <img src={sanityImgUrl(fetchedImage.image).crop("focalpoint").fit("crop").size(1200, 600).auto("format").url()} alt={(fetchedImage.image as any)?.asset?.altText} className="w-full md:w-[80vw] md:max-w-[1500px] h-56 md:h-80 md:rounded-2xl my-6 md:my-12 border-y-4 border-black md:border-4" />
                <div className="flex w-[calc(100%_-_2rem)] flex-col items-center rounded-2xl bg-primary-orange px-6 py-10 text-center text-off-white shadow-big-box-bg shadow-text-sm sm:w-5/6 sm:px-12 md:max-w-7xl md:px-24 lg:px-36">
                    <Typography as="p" className={`flex justify-center ${typographyTheme({ size: 'paragraph' })}`}>
                        {fetchedImage.missionText}
                    </Typography>
                </div>
                {fetchedImage.aboutText ? (
                    <div className="mt-12 flex w-[calc(100%_-_2rem)] flex-col items-center px-6 py-10 text-center sm:w-5/6 sm:px-12 md:max-w-7xl md:px-24 lg:px-36">
                        <Typography as="h2" className={`font-semibold ${typographyTheme({ size: 'h2' })}`}>
                            QUI SOMMES-NOUS?
                        </Typography>
                        <Typography as="p" className={typographyTheme({ size: 'paragraph' })}>
                            {fetchedImage.aboutText}
                        </Typography>
                    </div>
                ) : null}
                {fetchedImage.memberBenefits?.length ? (
                    <div className="mt-8 w-[calc(100%_-_2rem)] rounded-2xl bg-primary-green px-6 py-10 text-off-white shadow-big-box-bg sm:w-5/6 sm:px-12 md:max-w-7xl md:px-24">
                        <Typography as="h2" className={`text-center font-semibold ${typographyTheme({ size: 'h3' })}`}>
                            ÊTRE MEMBRE DE LA MAISON DE LA FAMILLE, C’EST…
                        </Typography>
                        <ul className="list-disc space-y-3 my-8 pl-6">
                            {fetchedImage.memberBenefits.map((benefit) => (
                                <li key={benefit} className={typographyTheme({ size: 'paragraph' })}>{benefit}</li>
                            ))}
                        </ul>
                        <Link href="/account" className="mx-auto block w-fit rounded-xl bg-off-white px-6 py-3 font-semibold text-primary-green">
                            Devenir membre
                        </Link>
                    </div>
                ) : null}
            </div>

            <div className="mx-4 my-16 flex flex-col items-center rounded-2xl bg-custom-beige shadow-big-box-bg sm:mx-16 sm:my-24">
                <Typography as={"h2"} className={`flex justify-center shadow-text-sm font-semibold text-center mt-4 ${typographyTheme({ size: 'h2' })}`}>
                    TÉMOIGNAGES
                </Typography>
                <div className="flex w-full flex-wrap justify-center gap-6 px-4 pb-8 sm:px-8">
                    {
                        fetchedTemoignages.temoignages?.map((temoignage, index) => {
                            return (
                                <div key={index} className="mt-6 flex w-full min-w-0 max-w-96 flex-col items-center rounded-2xl bg-primary-blue p-6 text-center text-off-white shadow-big-box-bg shadow-text-sm first-of-type:bg-primary-green last-of-type:bg-primary-red sm:p-8">
                                    <Typography as="p" className={`flex justify-center ${typographyTheme({ size: 'paragraph' })}`}>
                                        {temoignage.text}
                                    </Typography>
                                    <Typography as={"h5"} className={`my-4 ${typographyTheme({ size: 'h5' })}`}>
                                        {`- ${temoignage.name ?? "Anonyme"} -`}
                                    </Typography>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div>
                <Typography as="h2" className={`flex justify-center font-semibold text-center ${typographyTheme({ size: 'h2' })}`}>
                    NOTRE ÉQUIPE
                </Typography>
                <div className="mx-auto flex w-full max-w-[1700px] flex-row flex-wrap items-center justify-around gap-8 px-4 py-10 sm:px-8 sm:py-16">
                    {
                        fetchedTeamMembers.employees?.map((employee, index) => (
                            <EmployeeCard key={index} employee={employee} />
                        ))
                    }
                </div>
            </div>

            <div className="mx-4 my-16 flex flex-col items-center sm:mx-16 sm:my-24">
                <Typography as={"h2"} className={`flex justify-center font-semibold text-center mt-4 ${typographyTheme({ size: 'h2' })}`}>
                    ÉQUIPE ADMINISTRATIVE
                </Typography>
                <div className="flex w-full flex-wrap justify-center gap-6 px-4 pb-8 sm:px-8">
                    {
                        fetchedAdminTeamMembers.members?.map((employee) => (
                            <AdminTeamMemberCard key={employee._key} adminTeamMember={employee} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}
