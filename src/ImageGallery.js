import React from 'react';
import { Component } from 'react';
import { Modal } from 'react-bootstrap';
import apiKey from './constants';
import loadergif from './assets/loader.gif';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Image Gallery',
      imagesArr: [],
      showModal: false,
      modalImgUrl: '',
      searchParam: '',
      loader: false,
      error: false,
    };
  }

  openModal = (imgUrl) => {
    this.setState({ modalImgUrl: imgUrl }, () => {
      this.setState({ showModal: true });
    });
  };

  closeModal = () => {
    this.setState({ showModal: false, modalImgUrl: '' });
  };

  componentDidMount() {
    this.getImageList();
  }

  getImageList = () => {
    this.setState({ loader: true, error: false });
    fetch(
      `https://pixabay.com/api/?key=${apiKey}&image_type=photo&q=${encodeURI(
        this.state.searchParam
      )}`
    )
      .then((res) => res.json())
      .then((rep) => {
        this.setState({ loader: false });
        this.setState({ imagesArr: rep.hits });
      })
      .catch((err) => this.setState({ loader: false, error: true }));
  };

  handleChange = (e) => {
    this.setState({ searchParam: e.target.value }, () => {
      this.getImageList();
    });
  };

  render() {
    return (
      <>
        <h1 className="text-center m-3">Image Gallery </h1>
        <div className="row">
          <div className="col-12 p-5">
            <input
              type="text"
              name="search-input"
              onChange={this.handleChange}
              value={this.state.searchParam}
              className="form-control"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="gallery-container">
          {this.state.error && (
            <div className="row">
              <div className="col-12 px-5 text-center">
                <div className="alert alert-danger">Some Error Occurred!</div>
              </div>
            </div>
          )}
          {this.state.loader && (
            <div className="row">
              <div className="col-12">
                <div id="loader">
                  <img id="loading-image" src={loadergif} alt="Loading..." />
                </div>
              </div>
            </div>
          )}
          {this.state.loader === false && this.state.error === false && (
            <div className="row">
              {this.state.imagesArr.map((imageObj) => (
                <div key={imageObj.id} className="col col-3 mb-4 text-center">
                  <div
                    className="bg-image hover-overlay ripple shadow-1-strong rounded"
                    data-ripple-color="light"
                  >
                    <a href="!#" onClick={() => this.openModal(imageObj.webformatURL)}>
                      <img
                        src={imageObj.previewURL || imageObj.webformatURL.replace('_640', '_340')}
                        alt="Gallery Img"
                        className="img-thumbnail gallery-img"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal show={this.state.showModal} size="lg">
          <Modal.Body>
            <div className="w-100 text-center modal-img-body">
              <img
                src={this.state.modalImgUrl}
                alt="img-gallery"
                className="img-thumbnail h-100"
                loading="lazy"
              />
            </div>
            <div className="text-center py-3">
              <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default ImageGallery;
