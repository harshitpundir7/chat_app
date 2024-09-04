import Link from "next/link";

export default function({link, text} : {link: string, text: string}){
    return(
     <div className="poppins-thin text-lg hover:text-zinc-200">
        <Link href={link} >{text}</Link>
     </div>
    )
}