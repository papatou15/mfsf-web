/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Typography from "../components/Typography/Typography";
import typographyTheme from "../components/theme/Typography";
import { MissionImage, TeamMember, AdminTeamMember, Temoignages } from "@/sanity.types";
import { queryFetcher, aboutPageQuery } from "../queries";
import sanityImgUrl from "../sanityImageBuilder";
import { EmployeeCard } from "../components/EmployeeCard";
import { AdminTeamMemberCard } from "../components/adminTeamMemberCard";

export default async function Equipe() {

    const data = await queryFetcher(aboutPageQuery);
    const fetchedTeamMembers: TeamMember = data[2];
    const fetchedAdminTeamMembers: AdminTeamMember = data[0];
    const fetchedImage: MissionImage = data[1];
    const fetchedTemoignages: Temoignages = data[3];

    return (
        <>
            <div className="flex flex-col items-center my-16">
                <Typography as="h1" className={`flex justify-center font-semibold text-center ${typographyTheme({ size: 'h1' })}`}>
                    NOTRE MISSION
                </Typography>
                <img src={sanityImgUrl(fetchedImage.image).crop("focalpoint").fit("crop").size(1200, 600).auto("format").url()} alt={(fetchedImage.image as any)?.asset?.altText} className="w-full md:w-[80vw] md:max-w-[1500px] h-56 md:h-80 md:rounded-2xl my-6 md:my-12 border-y-4 border-black md:border-4" />
                <div className="flex flex-col items-center w-5/6 md:max-w-7xl bg-primary-orange py-10 px-12 md:px-24 lg:px-36 text-off-white shadow-text-sm rounded-2xl shadow-big-box-bg text-center">
                    <Typography as="p" className={`flex justify-center ${typographyTheme({ size: 'paragraph' })}`}>
                        {fetchedImage.missionText}
                    </Typography>
                </div>
            </div>

            <div className="flex flex-col items-center bg-custom-beige sm:mx-16 my-24 rounded-2xl shadow-big-box-bg">
                <Typography as={"h2"} className={`flex justify-center shadow-text-sm font-semibold text-center mt-4 ${typographyTheme({ size: 'h2' })}`}>
                    TÉMOIGNAGES
                </Typography>
                <div className="flex flex-wrap justify-center m-16 mt-0 w-full">
                    {
                        fetchedTemoignages.temoignages?.map((temoignage, index) => {
                            return (
                                <div key={index} className="min-w-80 max-w-96 flex flex-col mt-12 items-center text-center first-of-type:bg-primary-green last-of-type:bg-primary-red bg-primary-blue rounded-2xl shadow-big-box-bg mx-4 p-8 shadow-text-sm text-off-white">
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
                <div className="flex flex-row flex-wrap justify-around items-center m-16">
                    {
                        fetchedTeamMembers.employees?.map((employee, index) => (
                            <EmployeeCard key={index} employee={employee} />
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col items-center sm:mx-16 my-24">
                <Typography as={"h2"} className={`flex justify-center font-semibold text-center mt-4 ${typographyTheme({ size: 'h2' })}`}>
                    ÉQUIPE ADMINISTRATIVE
                </Typography>
                <div className="flex flex-wrap justify-center m-16 mt-0 w-full">
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