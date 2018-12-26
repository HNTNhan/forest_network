const vstruct = require('varstruct');
const base32 = require('base32.js');
const { Keypair } = require('stellar-base');



const Transaction = vstruct([
  { name: 'version', type: vstruct.UInt8 },
  { name: 'account', type: vstruct.Buffer(35) },
  { name: 'sequence', type: vstruct.UInt64BE },
  { name: 'memo', type: vstruct.VarBuffer(vstruct.UInt8) },
  { name: 'operation', type: vstruct.UInt8 },
  { name: 'params', type: vstruct.VarBuffer(vstruct.UInt16BE) },
  { name: 'signature', type: vstruct.Buffer(64) },
]);

const CreateAccountParams = vstruct([
  { name: 'address', type: vstruct.Buffer(35) },
]);

const PaymentParams = vstruct([
  { name: 'address', type: vstruct.Buffer(35) },
  { name: 'amount', type: vstruct.UInt64BE },
]);

const PostParams = vstruct([
  // Maximum length 65536 in bytes
  { name: 'content', type: vstruct.VarBuffer(vstruct.UInt16BE) },
  // Private share no more than 256 - 1 (me) people
  // 0 key => public post
  // >= 1 key => share with specific people, may including me. First 16/24 bytes of content are nonce/iv
  { name: 'keys', type: vstruct.VarArray(vstruct.UInt8, vstruct.Buffer(42)) },
]);



const UpdateAccountParams = vstruct([
  { name: 'key', type: vstruct.VarString(vstruct.UInt8) },
  { name: 'value', type: vstruct.VarBuffer(vstruct.UInt16BE) },
]);

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);

const InteractParams = vstruct([
  // Post or comment (or something else?)
  { name: 'object', type: vstruct.Buffer(32) },
  // Encrypt with same post key (if any)
  // Depend on object on parent object keys. First 16 bytes of content are nonce/iv
  { name: 'content', type: vstruct.VarBuffer(vstruct.UInt16BE) },
  // React if '', like, love, haha, anrgy, sad, wow
]);

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

const ReactContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'reaction', type: vstruct.UInt8 },
]);

export function encode(tx) {
  let params, operation;
  if (tx.version !== 1) {
    throw Error('Wrong version');
  }
  switch (tx.operation) {
    case 'create_account':
      params = CreateAccountParams.encode({
        ...tx.params,
        address: Buffer.from(base32.decode(tx.params.address)),
      });
      operation = 1;
      break;

    case 'payment':
      params = PaymentParams.encode({
        ...tx.params,
        address: Buffer.from(base32.decode(tx.params.address)),
      });
      operation = 2;
      break;

      case 'post':
        params = PostParams.encode({
            ...tx.params,
            content: PlainTextContent.encode(tx.params.content),
        });
      operation = 3;
      break;

      case 'update_account':
        if(tx.params.key === 'name') {
            params = UpdateAccountParams.encode({
                ...tx.params,
                value: Buffer.from(tx.params.value, "utf8")
            });
        }
        else if(tx.params.key === 'followings') {
            params = UpdateAccountParams.encode({
                ...tx.params,
                value: Followings.encode(tx.params.value),
            });
        }
         else{
            params = UpdateAccountParams.encode({
                ...tx.params,
                value: Buffer.from(tx.params.value, 'base64'),
            });
        }
      operation = 4;
      break;

    case 'interact':
        if(tx.params.content.type === 1) {
            params = InteractParams.encode({
                ...tx.params,
                object: Buffer.from(tx.params.object, 'hex'),
                content: PlainTextContent.encode(tx.params.content),
            });
        }
        else if (tx.params.content.type === 2) {
            params = InteractParams.encode({
                ...tx.params,
                object: Buffer.from(tx.params.object, 'hex'),
                content: ReactContent.encode(tx.params.content),
            });
        }

      operation = 5;
      break;

    default:
      throw Error('Unspport operation');
  }

  return Transaction.encode({
    version: 1,
    account: Buffer.from(base32.decode(tx.account)),
    sequence: tx.sequence,
    memo: tx.memo,
    operation,
    params,
    signature: tx.signature,
  });
}

export function decode(data) {
  const tx = Transaction.decode(data);
  if (tx.version !== 1) {
    throw Error('Wrong version');
  }
  let operation, params;
  switch (tx.operation) {
    case 1:
      operation = 'create_account';
      params = CreateAccountParams.decode(tx.params);
      params.address = base32.encode(params.address);
      Keypair.fromPublicKey(params.address);
      break;

    case 2:
      operation = 'payment';
      params = PaymentParams.decode(tx.params);
      params.address = base32.encode(params.address);
      Keypair.fromPublicKey(params.address);
      break;

    case 3:
      operation = 'post';
      params = PostParams.decode(tx.params);
      params.content = PlainTextContent.decode(params.content);
      break;

    case 4:
      operation = 'update_account';
      params = UpdateAccountParams.decode(tx.params);
      if(params.key === 'name') {
          params.value = params.value.toString("utf8");
      }
      else if(params.key === 'followings') {
          params.value = Followings.decode(params.value);
          for(let i =0; i<params.value.addresses.length; i++) {
              params.value.addresses[i] = base32.encode(params.value.addresses[i]);
          }
      }
      else {
          params.value = Buffer.from(params.value);
          params.value = params.value.toString("base64");
      }
      break;

    case 5:
      operation = 'interact';
      params = InteractParams.decode(tx.params);
      params.object = params.object.toString('hex').toUpperCase();
        let temp;
      try {
          temp = PlainTextContent.decode(params.content);
      }
      catch (e) {
          temp = ReactContent.decode(params.content);
      }
      if(temp.type === 1) {
            params.content = PlainTextContent.decode(params.content);
      }
      else if(temp.type === 2) {
          params.content = ReactContent.decode(params.content);
      }
      break;

    default:
      throw Error('Unspport operation');
  }
  return {
    version: 1,
    account: base32.encode(tx.account),
    sequence: tx.sequence,
    memo: tx.memo,
    operation,
    params,
    signature: tx.signature,
  };
}