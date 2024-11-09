"use client";

const Event = (props) => {
    return (
        <div className="container w-[500px] my-10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-lg p-6">
            <div className="title flex items-center justify-center w-full">
                <div className="title">
                    <h1 className="text-3xl font-bold">{props.attr.title}</h1>
                    <p>{props.attr.description}</p>
                </div>
            </div>
            <div className="body w-full mt-4 flex items-center justify-center flex-col">
                <img src="/dp.jpeg" alt="Event Display Image" className="w-full h-auto" />
                <span className="text-2xl">
                    From: {new Date(props.attr.from).toISOString().split('T')[0]} - To: {new Date(props.attr.to).toISOString().split('T')[0]}
                </span>
            </div>
            <div className="footer mt-4 flex items-center justify-center w-full">
                <button className="px-10 py-4 bg-blue-500 text-white rounded cursor-pointer m-auto">RSVP here</button>
            </div>
        </div>
    );
};

export default Event;
