import React from 'react';
import {Alert, FlatList, Modal} from 'react-native';

import {
  Wrapper,
  Header,
  Left,
  Right,
  Container,
  Space,
  Row,
  Column,
  H1,
  H2,
  Footer,
  FloatingLabelInput,
  Picker,
  Btn,
  IconBtn,
} from '../utils';
import sample_data from '../../sample_data';

import ProductListItem from '../reuse/ProductListItem';
import database from '@react-native-firebase/database';

export default class AddProduct extends React.Component {
  /*
 
  "name": "T-Shirt 0xx Small Size nala box",
            "sku": "SKU001",
            "images": [
                "http://intelvue.com/demo/app-template/light/p1.png",
                "http://intelvue.com/demo/app-template/light/p2.png"
            ],
            "price": "$200",
            "id": 1,
            "rating": 3,
            "brand_name": "My Brand",
            "description": "<h3>Full Description</h3><p>Nice Dude</p>",
            "specification": "<p>I am specs</p>"
    */

  state = {
    showAddressModal: false,
    id: '',
    name: '',
    rating: '',
    price: '',
    description: null,
    specification: '',
    brand_name: '',
    images: '',
    key: '',
    listData: [],
    isEdit: false,
  };

  _keyExtractor = (item, index) => item.id;

  inputs = {};

  componentDidMount() {
    database()
      .ref('Product/')
      .on('value', (snapshot) => {
        //console.log('User data: ', this.snapshotToArray(snapshot.val()));
        if (snapshot.val() !== null) {
          this.setState({listData: this.snapshotToArray(snapshot.val())});
        }
        console.log(this.state.listData);
      });
  }

  focusNextField(field) {
    if (inputs[field] !== undefined) {
      inputs[field].focus();
    }
  }

  snapshotToArray = (snapshot) =>
    Object.entries(snapshot).map((e) => Object.assign(e[1], {key: e[0]}));

  render() {
    return (
      <>
        <H1>Tambah Data Barang</H1>

        <FlatList
          data={this.state.listData}
          keyExtractor={(item) => item.key.toString()}
          extraData={this.state}
          renderItem={({item, index}) => (
            <ProductListItem
              item={item}
              onPress={() => {
                this.setState({
                  id: item.id,
                  name: item.name,
                  rating: item.rating,
                  price: item.price,
                  description: item.description,
                  specification: item.specification,
                  brand_name: item.brand_name,
                  images: item.images,
                  key: item.key,
                });
                this.setState({showAddressModal: true});
                this.setState({isEdit: true});
              }}
            />
          )}
        />

        <Btn
          label="Add Data"
          onPress={() => {
            this.setState({showAddressModal: true});
            this.setState({isEdit: false});
          }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showAddressModal}>
          {this._renderProduct()}
        </Modal>
      </>
    );
  }

  _renderProduct() {
    return (
      <Wrapper>
        <Header>
          <Left>
            <IconBtn
              icon={'x'}
              onPress={() => this.setState({showAddressModal: false})}
              style={{marginLeft: -10}}
            />
          </Left>
        </Header>

        <Container>
          <H2>Add New Product</H2>

          <FloatingLabelInput
            label="Name Product"
            onChangeText={(text) => this.setState({name: text})}
            returnKeyType={'next'}
            value={this.state.name}
            ref={(input) => {
              this.inputs['name'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('price');
            }}
          />

          <FloatingLabelInput
            label="Harga"
            onChangeText={(text) => this.setState({price: text})}
            returnKeyType={'next'}
            value={this.state.price}
            returnKeyType={'next'}
            ref={(input) => {
              this.inputs['price'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('description');
            }}
          />

          <FloatingLabelInput
            label="Deskripsi Product"
            onChangeText={(text) => this.setState({description: text})}
            returnKeyType={'next'}
            value={this.state.description}
            returnKeyType={'next'}
            ref={(input) => {
              this.inputs['description'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('spesification');
            }}
          />

          <FloatingLabelInput
            label="Spesifikasi Produk"
            onChangeText={(text) => this.setState({specification: text})}
            returnKeyType={'next'}
            value={this.state.specification}
            returnKeyType={'next'}
            ref={(input) => {
              this.inputs['specification'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('rating');
            }}
          />

          <FloatingLabelInput
            label="Rating"
            onChangeText={(text) => this.setState({rating: text})}
            value={this.state.rating}
            returnKeyType={'next'}
            ref={(input) => {
              this.inputs['rating'] = input;
            }}
            onSubmitEditing={() => {
              this.focusNextField('brand_name');
            }}
          />

          <FloatingLabelInput
            label="Brand Name"
            onChangeText={(text) => this.setState({brand_name: text})}
            value={this.state.brand_name}
            returnKeyType={'next'}
            ref={(input) => {
              this.inputs['brand_name'] = input;
            }}
            onSubmitEditing={() => {
              this.addProduct();
            }}
          />

          <Space />

          {this.addOrEdit()}
        </Container>
      </Wrapper>
    );
  }

  addOrEdit() {
    if (this.state.isEdit) {
      return <Btn label={'Edit Product'} onPress={() => this.editProduct()} />;
    } else {
      return <Btn label={'Add Product'} onPress={() => this.addProduct()} />;
    }
  }
  addProduct() {
    console.log('data', this.state);
    /*
	  	id: "",
		name: "",
		rating: "",
		price: "",
		description: null,
		specification: "",
		brand_name:"",
		images: "",
		
		*/
    database()
      .ref('Product/')
      .push({
        id: this.state.id,
        name: this.state.name,
        rating: this.state.rating,
        price: this.state.price,
        description: this.state.description,
        specification: this.state.specification,
        brand_name: this.state.brand_name,
        images: this.state.images,
      })
      .then((data) => {
        //success callback
        console.log('data ', data);
        this.setState({
          showAddressModal: false,
          id: '',
          name: '',
          rating: '',
          price: '',
          description: null,
          specification: '',
          brand_name: '',
          images: '',
        });
      })
      .catch((error) => {
        //error callback
        console.log('error ', error);
        Alert.alert('Gagal Insert', error);
      });
  }

  editProduct() {
    console.log('data', this.state);
    /*
			id: "",
		  name: "",
		  rating: "",
		  price: "",
		  description: null,
		  specification: "",
		  brand_name:"",
		  images: "",
		  
		  */
    database()
      .ref('Product/' + this.state.key)
      .update({
        id: this.state.id,
        name: this.state.name,
        rating: this.state.rating,
        price: this.state.price,
        description: this.state.description,
        specification: this.state.specification,
        brand_name: this.state.brand_name,
        images: this.state.images,
      })
      .then((data) => {
        //success callback
        console.log('data ', data);
        this.setState({
          showAddressModal: false,
          id: '',
          name: '',
          rating: '',
          price: '',
          description: null,
          specification: '',
          brand_name: '',
          images: '',
        });
      })
      .catch((error) => {
        //error callback
        console.log('error ', error);
        Alert.alert('Gagal Update', error);
      });
  }
}
