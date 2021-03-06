import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/fetchById'],
  submitting: loading.effects['role/submitForm'],
}))
@Form.create()
class RoleForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //prop.id modal传进来的， (props.match && props.match.params.id) url 上的
      id: props.id || (props.match && props.match.params.id),
      data: {},
      duplicate: props.duplicate || (props.match && props.match.params.duplicate),
      show: true,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    const { id } = this.state;
    if (id) {
      dispatch({
        type: 'role/fetchById',
        payload: id,
        callback: (response) => {
          this.setState({
            data: response || {},
          });
        }
      });
    }
  }

  handleCancel = () => {
    this.setState({
      show: false,
    })
  }

  handleReturn = () => {
    router.push(`/role/role-list`);
  };

  handleSubmit = e => {
    const {
      dispatch,
      form,
    } = this.props;
    const { duplicate } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (duplicate) {
          delete values.id;
        }
        dispatch({
          type: 'role/submitForm',
          payload: values,
          callback: (response) => {
            const {
              afterClose,
              queryList,
              role: {
                pagination, queryParams
              },
            } = this.props;

            if (afterClose) {
              this.handleCancel();
              queryList(pagination, queryParams);
            } else {
              this.handleReturn();
            }
          },
        });
      }
    });
  };

  renderFooter = () => {
    const { submitting } = this.props;
    return [
      <Button key="submit" type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
        <FormattedMessage id="form.submit" />
      </Button>,
      <Button key="cancel" style={{ marginLeft: 8 }} onClick={this.handleCancel}>
        <FormattedMessage id="form.cancel" />
      </Button>
    ];
  }

  render() {
    const {
      loading,
      submitting,
      form: { getFieldDecorator, getFieldValue },
      afterClose,
    } = this.props;


    const { id, data, duplicate, show } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };


    return (
      //
      afterClose ?
        <Modal
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={!id || duplicate ? <FormattedMessage id="app.role.add.title" /> : <FormattedMessage id="app.role.edit.title" />}
          visible={show}
          footer={this.renderFooter()}
          onCancel={this.handleCancel}
          afterClose={() => afterClose()}
        >
          <Card bordered={false} loading={loading}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
              {getFieldDecorator('id', { initialValue: data.id })
                (<Input hidden />)}
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.role.name" />}>
                {getFieldDecorator('name', {
                  initialValue: data.name,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.role.name' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.role.name.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.role.remark" />}>
                {getFieldDecorator('remark', {
                  initialValue: data.remark,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.role.remark' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.role.remark.placeholder' })} />)}
              </FormItem>
            </Form>
          </Card>
        </Modal>
        :
        <PageHeaderWrapper title={!id || duplicate ? <FormattedMessage id="app.role.add.title" /> : <FormattedMessage id="app.role.edit.title" />}>
          <Card bordered={false} loading={loading}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {getFieldDecorator('id', { initialValue: data.id })
                (<Input hidden />)}
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.role.name" />}>
                {getFieldDecorator('name', {
                  initialValue: data.name,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.role.name' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.role.name.placeholder' })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="app.role.remark" />}>
                {getFieldDecorator('remark', {
                  initialValue: data.remark,
                  rules: [
                    {
                      message: formatMessage({ id: 'validation.role.remark' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'app.role.remark.placeholder' })} />)}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="form.submit" />
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReturn}>
                  <FormattedMessage id="form.return" />
                </Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderWrapper>
    );
  }
}

export default RoleForm;
