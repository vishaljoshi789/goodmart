import { CgProfile } from "react-icons/cg";
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "../ui/button";

type UserCardProps = {
  name: string;
  email: string;
  username: string;
  phone_no: string;
  address: string;
  date_joined: string;
  last_login: string;
  email_verified: boolean;
  phone_verified: boolean;
  verifyMail: () => void;
};

const UserCard: React.FC<UserCardProps> = ({
  name,
  email,
  username,
  phone_no,
  address,
  date_joined,
  last_login,
  email_verified,
  phone_verified,
  verifyMail,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-10 lg:w-1/4 flex flex-col gap-2">
      <CgProfile className="text-9xl text-yellow-300 text-center w-full" />
      <h3 className="text-2xl font-bold mb-2 underline text-center my-2">
        {name}
      </h3>
      <p className="text-gray-700 mb-2 font-extrabold">User ID - {username}</p>
      <div className="flex gap-2 items-center">
        <span className="text-gray-600 text-xs font-bold">{email}</span>
        {email_verified ? (
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              <MdVerified className="text-green-500 text-xl" />
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              className="text-xs font-extrabold text-green-500 cursor-pointer w-fit"
            >
              Verified
            </HoverCardContent>
          </HoverCard>
        ) : (
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
              <VscUnverified className="text-red-500 text-xl" />
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              className="text-xs font-extrabold text-red-500 cursor-pointer w-fit flex gap-2 items-center"
            >
              <span>Not Verified</span>
              <Button className="bg-green-500 p-1" onClick={verifyMail}>
                Verify Now
              </Button>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-gray-600 text-xs font-bold">{phone_no}</span>
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger>
            <VscUnverified className="text-red-500 text-xl" />
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            className="text-xs font-extrabold text-red-500 cursor-pointer w-fit"
          >
            Not Verified
          </HoverCardContent>
        </HoverCard>
      </div>
      <p className="text-gray-600">{address}</p>
      <div>
        <span>Date Joined:</span>
        <span className="text-gray-600 date font-bold">{date_joined}</span>
      </div>
      <div>
        <span>Last Login: </span>
        <span className="text-gray-600 date font-bold">{last_login}</span>
      </div>
    </div>
  );
};

export default UserCard;
