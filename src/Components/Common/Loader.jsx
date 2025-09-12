import ReactLoading from "react-loading";

const Loader = () => {
  return (

    <div className='parent-loader'>
      <div className='child-loader'>
        <ReactLoading type="spinningBubbles" color="#274c77" />
      </div>
    </div>

  )
}

export default Loader
