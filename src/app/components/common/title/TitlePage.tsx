interface ITitlePageProps {
    title: string;
}

export const TitlePage = (props: ITitlePageProps) => {
    return (
        <div style={{marginTop: "70px", marginBottom: "30px"}}>
            <div className="row justify-content-center">
                <h1 className="text-center">{props.title}</h1>
            </div>
        </div>
    );
}

export default TitlePage;